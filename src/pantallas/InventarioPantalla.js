import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { firestore } from '../servicios/firebase';

export default function InventarioPantalla({ navigation }) {
  const [insumos, setInsumos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('inventario') // 👈 Ajusta si tu colección se llama diferente
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
    if (cantidad > 50) return '#4caf50'; // verde
    if (cantidad > 20) return '#ffb84d'; // dorado
    return '#ff4d4d'; // rojo
  };

  if (cargando) {
    return (
      <View style={[estilos.fondo, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ textAlign: 'center', color: '#fff', marginTop: 10 }}>Cargando inventario...</Text>
      </View>
    );
  }

  return (
    <View style={estilos.fondo}>
      <View style={estilos.contenedor}>
        <Text style={estilos.titulo}>Inventario de Insumos</Text>

        <TextInput
          placeholder="Buscar insumo..."
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={busqueda}
          onChangeText={setBusqueda}
          style={estilos.entrada}
        />

        <FlatList
          data={filtrarInsumos()}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={estilos.item}>
              <View style={estilos.itemTexto}>
                <Text style={estilos.itemNombre}>{item.nombre}</Text>
                <Text style={estilos.itemCantidad}>
                  Cantidad: <Text style={{ color: obtenerColorStock(item.cantidad) }}>{item.cantidad}</Text>
                </Text>
              </View>
              <View
                style={[
                  estilos.estado,
                  { backgroundColor: obtenerColorStock(item.cantidad) },
                ]}
              />
            </View>
          )}
        />

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

const estilos = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: '#ff6b35',
    paddingVertical: 40,
  },
  contenedor: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
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
