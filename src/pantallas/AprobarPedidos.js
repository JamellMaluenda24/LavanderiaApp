// src/pantallas/AprobarPedidos.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { firestore } from '../servicios/firebase';

export default function AprobarPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // 🔄 Cargar pedidos pendientes desde Firestore
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('pedidos')
      .where('estado', '==', 'pendiente')
      .onSnapshot(
        snapshot => {
          const pedidosData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPedidos(pedidosData);
          setCargando(false);
        },
        error => {
          console.error('Error al obtener pedidos:', error);
          Alert.alert('Error', 'No se pudieron cargar los pedidos.');
          setCargando(false);
        }
      );

    return () => unsubscribe();
  }, []);

  // ✅ Aprobar pedido y actualizar inventario
  const aprobarPedido = async (pedidoId, insumos) => {
    try {
      const batch = firestore().batch();

      for (const insumo of insumos) {
        const inventarioRef = firestore().collection('inventario').doc(insumo.idInsumo);
        const inventarioSnap = await inventarioRef.get();

        if (inventarioSnap.exists) {
          const datos = inventarioSnap.data();
          const nuevoStock = (datos.stock || 0) + (insumo.stock || 0);
          batch.update(inventarioRef, { stock: nuevoStock });
        } else {
          // Si el insumo no existe, se crea automáticamente
          batch.set(inventarioRef, {
            nombre: insumo.nombre,
            stock: insumo.stock || 0,
            unidad: insumo.unidad || 'unidad',
          });
        }
      }

      // ✅ Cambiar estado del pedido
      const pedidoRef = firestore().collection('pedidos').doc(pedidoId);
      batch.update(pedidoRef, { estado: 'aprobado' });

      await batch.commit();
      Alert.alert('✅ Pedido aprobado', 'El inventario se actualizó correctamente.');
    } catch (error) {
      console.error('Error al aprobar pedido:', error);
      Alert.alert('Error', 'No se pudo aprobar el pedido.');
    }
  };

  // ❌ Rechazar pedido
  const rechazarPedido = async (pedidoId) => {
    try {
      await firestore().collection('pedidos').doc(pedidoId).update({ estado: 'rechazado' });
      Alert.alert('❌ Pedido rechazado', 'El pedido ha sido rechazado.');
    } catch (error) {
      console.error('Error al rechazar pedido:', error);
      Alert.alert('Error', 'No se pudo rechazar el pedido.');
    }
  };

  // 🔁 Renderizado principal
  if (cargando) {
    return (
      <View style={styles.cargando}>
        <ActivityIndicator size="large" color="#e85d2e" />
        <Text style={{ color: '#555', marginTop: 10 }}>Cargando pedidos...</Text>
      </View>
    );
  }

  if (pedidos.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.mensaje}>No hay pedidos pendientes.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Aprobar Pedidos</Text>
      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.texto}>
              <Text style={styles.label}>Proveedor:</Text> {item.idProveedor || 'Desconocido'}
            </Text>

            <Text style={styles.texto}>
              <Text style={styles.label}>Estado:</Text> {item.estado}
            </Text>

            <Text style={[styles.label, { marginTop: 10 }]}>Insumos:</Text>
            {item.Insumos?.map((insumo, index) => (
              <Text key={index} style={styles.texto}>
                • {insumo.nombre} — {insumo.stock} {insumo.unidad || 'unidades'}
              </Text>
            ))}

            <View style={styles.botones}>
              <TouchableOpacity
                style={[styles.boton, { backgroundColor: '#4CAF50' }]}
                onPress={() => aprobarPedido(item.id, item.Insumos || [])}
              >
                <Text style={styles.textoBoton}>Aprobar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.boton, { backgroundColor: '#f44336' }]}
                onPress={() => rechazarPedido(item.id)}
              >
                <Text style={styles.textoBoton}>Rechazar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

// 🎨 Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff5ee',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e85d2e',
    textAlign: 'center',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#ffe6d5',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  texto: {
    fontSize: 16,
    color: '#333',
    marginBottom: 3,
  },
  label: {
    fontWeight: 'bold',
    color: '#e85d2e',
  },
  botones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  boton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  textoBoton: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cargando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff5ee',
  },
  mensaje: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginTop: 50,
  },
});
