import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { firestore } from '../servicios/firebase';

export default function AlertasPantalla({ navigation }) {
  const [alertas, setAlertas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('inventario') // 👈 Ajusta si tu colección tiene otro nombre
      .onSnapshot(snapshot => {
        const lista = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(item => item.cantidad <= 50); // 🔥 solo muestra los que están bajos
        setAlertas(lista);
        setCargando(false);
      });

    return unsubscribe;
  }, []);

  const obtenerColorStock = cantidad => {
    if (cantidad > 20) return '#ffb84d'; // 🟡 Bajo
    return '#ff4d4d'; // 🔴 Crítico
  };

  if (cargando) {
    return (
      <View style={[estilos.fondo, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ textAlign: 'center', color: '#fff', marginTop: 10 }}>Cargando alertas...</Text>
      </View>
    );
  }

  return (
    <View style={estilos.fondo}>
      <View style={estilos.contenedor}>
        <Text style={estilos.titulo}>Alertas de Inventario</Text>

        {alertas.length === 0 ? (
          <Text style={estilos.sinAlertas}>✅ Todo el inventario está en niveles óptimos.</Text>
        ) : (
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
