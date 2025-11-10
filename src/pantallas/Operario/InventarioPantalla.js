// Pantalla de Inventario de Insumos

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { firestore } from '../../servicios/firebase';

export default function InventarioPantalla({ navigation }) {

  const [insumos, setInsumos] = useState([]);
  const [busqueda, setBusqueda] = useState(''); 
  const [cargando, setCargando] = useState(true); 

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('inventario')
      .onSnapshot(snapshot => {
        const lista = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInsumos(lista);
        setCargando(false);
      });

    return unsubscribe;
  }, []);

  const filtrarInsumos = () => {
    return insumos.filter(i =>
      i.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
  };

  const obtenerColorStock = cantidad => {
    if (cantidad > 50) return '#4caf50'; 
    if (cantidad > 20) return '#ffb84d'; 
    return '#ff4d4d';
  };


  if (cargando) {
    return (
      <View style={estilos.cargando}>
        <ActivityIndicator size="large" color="#e85d2e" />
        <Text style={estilos.textoCargando}>Cargando inventario...</Text>
      </View>
    );
  }


  return (
    <SafeAreaView style={estilos.safeArea}>
      <View style={estilos.container}>
        {/* Título principal */}
        <Text style={estilos.titulo}>Inventario de Insumos</Text>

        {/* Campo de búsqueda */}
        <TextInput
          placeholder="Buscar insumo..."
          placeholderTextColor="#999"
          value={busqueda}
          onChangeText={setBusqueda}
          style={estilos.input}
        />

        {/* Lista de insumos (filtrada en tiempo real) */}
        <FlatList
          data={filtrarInsumos()}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={estilos.item}>
              <View style={estilos.itemInfo}>
                <Text style={estilos.itemNombre}>{item.nombre}</Text>
                <Text style={estilos.itemCantidad}>
                  Cantidad:{' '}
                  <Text
                    style={{
                      color: obtenerColorStock(item.cantidad),
                      fontWeight: 'bold',
                    }}
                  >
                    {item.cantidad}
                  </Text>
                </Text>
              </View>

              {/* Indicador de color del stock */}
              <View
                style={[
                  estilos.indicador,
                  { backgroundColor: obtenerColorStock(item.cantidad) },
                ]}
              />
            </View>
          )}
          ListEmptyComponent={
            <Text style={estilos.vacio}>No hay insumos registrados.</Text>
          }
          contentContainerStyle={{ paddingBottom: 100 }}
        />

        {/* Botón para volver a la pantalla anterior */}
        <TouchableOpacity
          style={estilos.botonVolver}
          onPress={() => navigation.goBack()}
        >
          <Text style={estilos.textoBotonVolver}>Volver</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff5ee', 
  },
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
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e85d2e66',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    color: '#333',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebd6',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e85d2e33',
    padding: 15,
    marginVertical: 6,
  },
  itemInfo: { flex: 1 },
  itemNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemCantidad: {
    fontSize: 14,
    color: '#555',
    marginTop: 3,
  },
  indicador: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginLeft: 10,
  },
  vacio: {
    textAlign: 'center',
    color: '#777',
    marginTop: 20,
  },
  botonVolver: {
    borderWidth: 1.5,
    borderColor: '#e85d2e',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 15,
    marginBottom: 30,
  },
  textoBotonVolver: {
    textAlign: 'center',
    color: '#e85d2e',
    fontWeight: 'bold',
    fontSize: 15,
  },
  cargando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff5ee',
  },
  textoCargando: {
    marginTop: 10,
    color: '#555',
  },
});
