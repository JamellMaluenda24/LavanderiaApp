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

export default function AlertasPantalla({ navigation }) {

  const [alertas, setAlertas] = useState([]); 
  const [cargando, setCargando] = useState(true); 

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('inventario')
      .onSnapshot(snapshot => {
        const lista = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));


        const enRojo = lista.filter(item => {
          const stock = Number(item.stock ?? 0);
          return stock <= 15;
        });

        setAlertas(enRojo);
        setCargando(false);
      });

    return unsubscribe;
  }, []);

  const obtenerColorStock = (cantidad) => {
    const num = Number(cantidad) || 0;
    if (num > 50) return '#4caf50';   
    if (num > 20) return '#ffb84d';   
    return '#ff4d4d';                 
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

        {alertas.length === 0 ? (
          <Text style={estilos.vacio}>Todo el inventario está en niveles óptimos.</Text>
        ) : (
          <FlatList
            data={alertas}
            keyExtractor={item => item.id}
            renderItem={({ item }) => {
              const cantidad = Number(item.stock ?? 0); 
              const colorStock = obtenerColorStock(cantidad);

              return (
                <View style={estilos.item}>
                  <View style={estilos.itemInfo}>
                    <Text style={estilos.itemNombre}>{item.nombre}</Text>
                    <Text style={estilos.itemCantidad}>
                      Cantidad actual:{' '}
                      <Text
                        style={{
                          color: colorStock,
                          fontWeight: 'bold',
                        }}
                      >
                        {cantidad}
                      </Text>
                    </Text>
                  </View>
                  <View
                    style={[
                      estilos.indicador,
                      { backgroundColor: colorStock },
                    ]}
                  />
                </View>
              );
            }}
            ListEmptyComponent={
              <Text style={estilos.vacio}>No hay alertas disponibles.</Text>
            }
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}

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
