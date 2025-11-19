

import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  Alert, ActivityIndicator 
} from 'react-native';
import { firestore } from '../../servicios/firebase';

export default function GestionProveedores({ route, navigation }) {
  const proveedor = route?.params?.proveedor;
  const [pedidosAprobados, setPedidosAprobados] = useState([]);
  const [cargando, setCargando] = useState(true);

  if (!proveedor) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>No se seleccionó proveedor</Text>
      </View>
    );
  }


  useEffect(() => {
    const unsubscribe = firestore()
      .collection('pedidos')
      .where('idProveedor', '==', proveedor.id)
      .where('estado', '==', 'aprobado')
      .onSnapshot(
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPedidosAprobados(data);
          setCargando(false);
        },
        (error) => {
          console.error('Error al cargar pedidos del proveedor:', error);
          Alert.alert('Error', 'No se pudieron cargar los pedidos aprobados.');
          setCargando(false);
        }
      );

    return () => unsubscribe();
  }, [proveedor.id]);


  const editarProveedor = () => {
    navigation.navigate('EditarProveedor', { proveedorId: proveedor.id });
  };


  const eliminarProveedor = async () => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Seguro que deseas eliminar a ${proveedor.nombre}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await firestore().collection('proveedores').doc(proveedor.id).delete();
              Alert.alert('Proveedor eliminado', `${proveedor.nombre} fue eliminado.`);
              navigation.goBack();
            } catch (error) {
              console.error('Error al eliminar proveedor:', error);
              Alert.alert('Error', 'No se pudo eliminar el proveedor.');
            }
          },
        },
      ]
    );
  };


  if (cargando) {
    return (
      <View style={styles.cargando}>
        <ActivityIndicator size="large" color="#e85d2e" />
        <Text style={styles.textoCargando}>Cargando pedidos aprobados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>{proveedor.nombre}</Text>
      <Text style={styles.subtexto}>
        {proveedor.telefono || 'Sin teléfono'} | {proveedor.direccion || 'Sin dirección'}
      </Text>


      <Text style={styles.subtitulo}>Pedidos aprobados</Text>

      <FlatList
        data={pedidosAprobados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.entrega}>
            <Text style={styles.label}>📦 Pedido #{item.id}</Text>
            <Text>📅 Fecha: {item.fechaPedido || 'Sin fecha'}</Text>
            <Text>🟢 Estado: {item.estado}</Text>

            <Text style={styles.label}>Insumos:</Text>
            {item.Insumos?.map((insumo, index) => (
              <Text key={index} style={styles.insumo}>
                • {insumo.nombre} — {insumo.stock} {insumo.unidad || 'unidades'}
              </Text>
            ))}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.vacio}>
            No hay pedidos aprobados registrados para este proveedor.
          </Text>
        }
      />

      <View style={styles.menuCRUD}>
        <TouchableOpacity style={styles.botonCRUD} onPress={editarProveedor}>
          <Text style={styles.textoBoton}> Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botonCRUD} onPress={eliminarProveedor}>
          <Text style={styles.textoBoton}> Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff5ee' },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#e85d2e', marginBottom: 5 },
  subtexto: { fontSize: 14, color: '#555', marginBottom: 15 },
  subtitulo: { fontSize: 18, fontWeight: 'bold', color: '#e85d2e', marginBottom: 10 },
  entrega: {
    padding: 12,
    marginVertical: 8,
    backgroundColor: '#ffebd6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e85d2e33',
  },
  label: { fontWeight: 'bold', color: '#333', marginTop: 5 },
  insumo: { fontSize: 15, color: '#333', marginLeft: 10 },
  vacio: { textAlign: 'center', color: '#777', marginTop: 20 },
  cargando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff5ee',
  },
  textoCargando: { marginTop: 10, color: '#555' },
  menuCRUD: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  botonCRUD: {
    backgroundColor: '#e85d2e',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  textoBoton: { color: '#fff', fontWeight: 'bold' },
});
