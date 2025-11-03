// Pantalla: Alertas de Inventario
// Muestra los productos cuyo stock está bajo en Firestore (menor o igual a 50 unidades).
// Escucha los cambios en tiempo real y actualiza la lista automáticamente.

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { firestore } from '../servicios/firebase';

export default function AlertasPantalla({ navigation }) {
  // Estado para almacenar las alertas obtenidas desde Firestore
  const [alertas, setAlertas] = useState([]);

  // Estado de carga para mostrar indicador mientras se obtienen los datos
  const [cargando, setCargando] = useState(true);

  // useEffect: se ejecuta al montar el componente
  useEffect(() => {
    // Escucha los cambios en la colección "inventario" en tiempo real
    const unsubscribe = firestore()
      .collection('inventario') // Cambiar el nombre si la colección se llama diferente
      .onSnapshot(snapshot => {
        // Mapea los documentos obtenidos a objetos de JavaScript
        const lista = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
          // Filtra los productos con cantidad menor o igual a 50
          .filter(item => item.cantidad <= 50);

        setAlertas(lista);
        setCargando(false);
      });

    // Detiene la suscripción al desmontar el componente
    return unsubscribe;
  }, []);

  // Función auxiliar para determinar el color del indicador de stock
  const obtenerColorStock = cantidad => {
    if (cantidad > 20) return '#ffb84d'; // Naranja/amarillo para nivel bajo
    return '#ff4d4d'; // Rojo para nivel crítico
  };

  // Muestra un indicador de carga mientras se obtienen los datos
  if (cargando) {
    return (
      <View style={[estilos.fondo, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ textAlign: 'center', color: '#fff', marginTop: 10 }}>Cargando alertas...</Text>
      </View>
    );
  }

  // Vista principal
  return (
    <View style={estilos.fondo}>
      <View style={estilos.contenedor}>
        <Text style={estilos.titulo}>Alertas de Inventario</Text>

        {/* Si no hay alertas, muestra mensaje de todo en orden */}
        {alertas.length === 0 ? (
          <Text style={estilos.sinAlertas}>Todo el inventario está en niveles óptimos.</Text>
        ) : (
          // Si hay alertas, las muestra en una lista
          <FlatList
            data={alertas}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={estilos.item}>
                <View style={estilos.itemTexto}>
                  <Text style={estilos.itemNombre}>{item.nombre}</Text>
                  <Text style={estilos.itemCantidad}>
                    Cantidad actual:{' '}
                    <Text style={{ color: obtenerColorStock(item.cantidad) }}>{item.cantidad}</Text>
                  </Text>
                </View>

                {/* Indicador visual de estado del stock */}
                <View
                  style={[
                    estilos.estado,
                    { backgroundColor: obtenerColorStock(item.cantidad) },
                  ]}
                />
              </View>
            )}
          />
        )}

        {/* Botón para volver a la pantalla anterior */}
        <TouchableOpacity
          style={estilos.botonSecundario}
          onPress={() => navigation.goBack()}
        >
          <Text style={estilos.textoBotonSecundario}>Volver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Estilos visuales de la pantalla
const estilos = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: '#ff6b35', // Fondo naranja principal
    paddingVertical: 40,
  },
  contenedor: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)', // Fondo con transparencia
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
  },
  titulo: {
    fontSize: 26,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  itemTexto: {
    flex: 1,
  },
  itemNombre: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  itemCantidad: {
    fontSize: 15,
    color: '#ddd',
  },
  estado: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  sinAlertas: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    marginTop: 40,
  },
  botonSecundario: {
    borderWidth: 1.5,
    borderColor: '#ffb84d',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 15,
  },
  textoBotonSecundario: {
    textAlign: 'center',
    color: '#ffb84d',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
