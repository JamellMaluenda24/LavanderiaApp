// ===============================================
// Pantalla de Inventario de Insumos (Administrador)
// ===============================================

import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, StyleSheet, TouchableOpacity, Alert 
} from 'react-native';
import { firestore } from '../../servicios/firebase';

export default function InventarioAdmin() {
  const [inventario, setInventario] = useState([]);

  // Escuchar inventario en tiempo real desde Firestore
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('inventario')
      .onSnapshot(
        snapshot => {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setInventario(data);

          // Mostrar alerta si hay insumos bajo el mínimo
          const bajos = data.filter(item => item.stock <= (item.minimo || 2));
          if (bajos.length > 0) {
            const nombres = bajos.map(i => i.nombre).join(', ');
            Alert.alert(
              'Stock bajo',
              `Los siguientes insumos están por debajo del mínimo:\n${nombres}`
            );
          }
        },
        error => {
          console.error('Error al obtener inventario:', error);
          Alert.alert('Error', 'No se pudo cargar el inventario.');
        }
      );

    return () => unsubscribe();
  }, []);

  // Aumentar stock manualmente
  const aumentarStock = async (id, stockActual) => {
    try {
      await firestore().collection('inventario').doc(id).update({
        stock: stockActual + 1,
      });
    } catch (error) {
      console.error('Error al aumentar stock:', error);
      Alert.alert('Error', 'No se pudo actualizar el stock.');
    }
  };

  // Disminuir stock manualmente
  const disminuirStock = async (id, stockActual) => {
    if (stockActual <= 0) return;
    try {
      await firestore().collection('inventario').doc(id).update({
        stock: stockActual - 1,
      });
    } catch (error) {
      console.error('Error al disminuir stock:', error);
      Alert.alert('Error', 'No se pudo actualizar el stock.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.item, item.stock <= (item.minimo || 2) && styles.alerta]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text style={styles.stock}>
          Stock: {item.stock} {item.unidad || ''} (Mínimo: {item.minimo || 2})
        </Text>
      </View>
      <View style={styles.botones}>
        <TouchableOpacity
          style={[styles.boton, { backgroundColor: '#f44336' }]}
          onPress={() => disminuirStock(item.id, item.stock)}
        >
          <Text style={styles.textoBoton}>−</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.boton, { backgroundColor: '#4CAF50' }]}
          onPress={() => aumentarStock(item.id, item.stock)}
        >
          <Text style={styles.textoBoton}>＋</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Inventario de Insumos</Text>
      <FlatList
        data={inventario}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.vacio}>No hay insumos registrados.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fffaf5' },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e85d2e',
    marginBottom: 20,
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffecd6',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  alerta: {
    backgroundColor: '#ffe0e0',
    borderColor: '#ff4d4d',
    borderWidth: 1,
  },
  nombre: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  stock: { fontSize: 14, color: '#555' },
  botones: { flexDirection: 'row', marginLeft: 10 },
  boton: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
  },
  textoBoton: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  vacio: { textAlign: 'center', fontSize: 16, color: '#777', marginTop: 20 },
});
