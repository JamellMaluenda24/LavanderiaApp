
// Pantalla de Alertas de Inventario


import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { firestore } from '../../servicios/firebase';


// Componente principal

export default function AlertasPantalla({ navigation }) {
  // ESTADOS
  const [alertas, setAlertas] = useState([]); // Lista de productos con bajo stock
  const [cargando, setCargando] = useState(true); // Control de carga inicial


  // Escucha los cambios en la colección 'inventario' y filtra productos con cantidad <= 50.
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('inventario')
      .onSnapshot(snapshot => {
        const lista = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(item => item.cantidad <= 50);

        setAlertas(lista);
        setCargando(false);
      });

    // Limpieza de suscripción al desmontar el componente
    return unsubscribe;
  }, []);


  const obtenerColorStock = cantidad => {
    if (cantidad > 20) return '#ffb84d'; // Naranja/amarillo = bajo
    return '#ff4d4d'; // Rojo = crítico
  };


  if (cargando) {
    return (
      <View style={estilos.cargando}>
        <ActivityIndicator size="large" color="#e85d2e" />
        <Text style={estilos.textoCargando}>Cargando alertas...</Text>
      </View>
    );
  }


  return (
    <SafeAreaView style={estilos.safeArea}>
      <View style={estilos.container}>
        <Text style={estilos.titulo}>Alertas de Inventario</Text>

        {/* Lista de productos en alerta o mensaje vacío */}
        {alertas.length === 0 ? (
          <Text style={estilos.vacio}>Todo el inventario está en niveles óptimos.</Text>
        ) : (
          <FlatList
            data={alertas}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={estilos.item}>
                <View style={estilos.itemInfo}>
                  <Text style={estilos.itemNombre}>{item.nombre}</Text>
                  <Text style={estilos.itemCantidad}>
                    Cantidad actual:{' '}
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
                <View
                  style={[
                    estilos.indicador,
                    { backgroundColor: obtenerColorStock(item.cantidad) },
                  ]}
                />
              </View>
            )}
            ListEmptyComponent={
              <Text style={estilos.vacio}>No hay alertas disponibles.</Text>
            }
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}

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


// Estilos de la interfaz

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
  itemInfo: {
    flex: 1,
  },
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
    fontSize: 15,
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
