// ===============================================
// Pantalla de ListaProveedores
// ===============================================

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { firestore } from '../../servicios/firebase';

export default function ListaProveedores({ navigation }) {
  const [proveedores, setProveedores] = useState([]);
  const [cargando, setCargando] = useState(true);

<<<<<<< HEAD:src/pantallas/ListaProveedores.js
=======
  //Cargar proveedores en tiempo real desde Firestore
>>>>>>> 11db5cd (Mejora de diseño de las interfaces y se añaden comentarios):src/pantallas/Admin/ListaProveedores.js
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('proveedores')
      .onSnapshot(
        snapshot => {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProveedores(data);
          setCargando(false);
        },
        error => {
          console.error('Error al obtener proveedores:', error);
          Alert.alert('Error', 'No se pudieron cargar los proveedores.');
          setCargando(false);
        }
      );

    return () => unsubscribe();
  }, []);

  //Ver detalles del proveedor seleccionado
  const verProveedor = (proveedor) => {
    navigation.navigate('GestionProveedores', { proveedor });
  };

  if (cargando) {
    return (
      <View style={styles.cargando}>
        <ActivityIndicator size="large" color="#e85d2e" />
        <Text style={styles.textoCargando}>Cargando proveedores...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>📋 Proveedores</Text>

      <FlatList
        data={proveedores}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => verProveedor(item)}>
            <Text style={styles.texto}>{item.nombre}</Text>
            <Text style={styles.subtexto}>
              {item.telefono ? item.telefono : 'Sin teléfono'} | {item.direccion ? item.direccion : 'Sin dirección'}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.vacio}>No hay proveedores registrados.</Text>}
      />

      <TouchableOpacity
        style={styles.botonAgregar}
        onPress={() => navigation.navigate('AgregarProveedor')}
      >
        <Text style={styles.textoBoton}>➕ Agregar Proveedor</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff5ee' },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#e85d2e', marginBottom: 20, textAlign: 'center' },
  item: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#ffebd6',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e85d2e33',
  },
  texto: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  subtexto: { fontSize: 14, color: '#555' },
  botonAgregar: {
    backgroundColor: '#e85d2e',
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
    alignItems: 'center',
  },
  textoBoton: { color: '#fff', fontWeight: 'bold' },
  vacio: { textAlign: 'center', color: '#777', marginTop: 20 },
  cargando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff5ee',
  },
  textoCargando: { marginTop: 10, color: '#555' },
});
