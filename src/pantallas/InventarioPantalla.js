// Pantalla: Inventario de Insumos
// Esta pantalla muestra el inventario completo obtenido desde Firestore.
// Permite buscar insumos por nombre y visualizar su estado de stock mediante colores.

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { firestore } from '../servicios/firebase';

export default function InventarioPantalla({ navigation }) {
  // Estado que almacena los insumos obtenidos desde Firestore
  const [insumos, setInsumos] = useState([]);

  // Estado para el texto del buscador
  const [busqueda, setBusqueda] = useState('');

  // Estado de carga para mostrar indicador mientras se obtienen los datos
  const [cargando, setCargando] = useState(true);

  // useEffect: se ejecuta al montar el componente
  useEffect(() => {
    // Escucha en tiempo real los cambios de la colección "inventario"
    const unsubscribe = firestore()
      .collection('inventario') // Cambiar si la colección tiene otro nombre
      .onSnapshot(snapshot => {
        // Mapea los documentos obtenidos y guarda sus datos en el estado
        const lista = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInsumos(lista);
        setCargando(false);
      });

    // Detiene la suscripción al desmontar el componente
    return unsubscribe;
  }, []);

  // Filtra los insumos según el texto ingresado en la búsqueda
  const filtrarInsumos = () => {
    return insumos.filter(i =>
      i.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
  };

  // Define el color del estado según la cantidad disponible
  const obtenerColorStock = cantidad => {
    if (cantidad > 50) return '#4caf50'; // Verde: nivel óptimo
    if (cantidad > 20) return '#ffb84d'; // Dorado: nivel bajo
    return '#ff4d4d'; // Rojo: nivel crítico
  };

  // Muestra indicador de carga mientras los datos se obtienen
  if (cargando) {
    return (
      <View style={[estilos.fondo, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ textAlign: 'center', color: '#fff', marginTop: 10 }}>
          Cargando inventario...
        </Text>
      </View>
    );
  }

  // Vista principal del inventario
  return (
    <View style={estilos.fondo}>
      <View style={estilos.contenedor}>
        <Text style={estilos.titulo}>Inventario de Insumos</Text>

        {/* Campo de búsqueda */}
        <TextInput
          placeholder="Buscar insumo..."
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={busqueda}
          onChangeText={setBusqueda}
          style={estilos.entrada}
        />

        {/* Lista de insumos */}
        <FlatList
          data={filtrarInsumos()}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={estilos.item}>
              <View style={estilos.itemTexto}>
                <Text style={estilos.itemNombre}>{item.nombre}</Text>
                <Text style={estilos.itemCantidad}>
                  Cantidad:{' '}
                  <Text style={{ color: obtenerColorStock(item.cantidad) }}>
                    {item.cantidad}
                  </Text>
                </Text>
              </View>

              {/* Indicador visual del estado del stock */}
              <View
                style={[
                  estilos.estado,
                  { backgroundColor: obtenerColorStock(item.cantidad) },
                ]}
              />
            </View>
          )}
        />

        {/* Botón para volver atrás */}
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

// Estilos de la interfaz visual
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
  entrada: {
    borderWidth: 1.5,
    borderColor: '#ffb84d',
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.15)',
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
