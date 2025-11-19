// ===============================================
// Pantalla de Inventario (admin)
// ===============================================

import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, StyleSheet, TouchableOpacity, Alert 
} from 'react-native';
import { firestore } from '../../servicios/firebase';

export default function InventarioAdmin() {
  const [inventario, setInventario] = useState([]);

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

  // === YA NO EXISTEN LOS BOTONES, SOLO VISUALIZACIÓN ===
  const renderItem = ({ item }) => (
    <View style={[styles.item, item.stock <= (item.minimo || 2) && styles.alerta]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text style={styles.stock}>
          Stock: {item.stock} {item.unidad || ''} (Mínimo: {item.minimo || 2})
        </Text>
      </View>
      {/* ← Se eliminaron los botones de aumentar y disminuir */}
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
  vacio: { textAlign: 'center', fontSize: 16, color: '#777', marginTop: 20 },
});
