// ===============================================
// Pantalla Principal del Operario
// ===============================================

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { auth, firestore } from '../../servicios/firebase';

export default function InicioPantalla({ navigation }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // ------------------ OBTENER DATOS DEL USUARIO ------------------
  useEffect(() => {
    const uid = auth().currentUser?.uid;
    if (!uid) return;

    const obtenerDatos = async () => {
      try {
        const doc = await firestore().collection('usuarios').doc(uid).get();
        if (doc.exists) {
          setUsuario(doc.data());
        }
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        Alert.alert('Error', 'No se pudieron cargar los datos del usuario.');
      } finally {
        setCargando(false);
      }
    };

    obtenerDatos();
  }, []);

  // ------------------ CERRAR SESIÓN ------------------
  const cerrarSesion = async () => {
    try {
      await auth().signOut();
      Alert.alert('Sesión cerrada', 'Has cerrado sesión correctamente.');
      navigation.reset({
        index: 0,
        routes: [{ name: 'InicioSesion' }],
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert('Error', 'No se pudo cerrar sesión. Intenta nuevamente.');
    }
  };

  // ------------------ INTERFAZ ------------------
  if (cargando) {
    return (
      <View style={estilos.cargando}>
        <ActivityIndicator size="large" color="#ff6b35" />
        <Text style={{ color: '#777', marginTop: 10 }}>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={estilos.fondo}>
      <ScrollView contentContainerStyle={estilos.scroll}>
        <Text style={estilos.titulo}>Panel del Operario</Text>

        {/* Datos del usuario */}
        <View style={estilos.tarjetaUsuario}>
          <View style={estilos.datosUsuario}>
            <Text style={estilos.nombre}>{usuario?.nombre || 'Usuario'}</Text>
            <Text style={estilos.correo}>{usuario?.correo}</Text>
          </View>
        </View>

        {/* MENÚ PRINCIPAL */}
        <View style={estilos.menu}>
          <TouchableOpacity
            style={estilos.card}
            onPress={() => navigation.navigate('RegistroConsumo')}
          >
            <Text style={estilos.textoCard}>Registrar Consumo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={estilos.card}
            onPress={() => navigation.navigate('Inventario')}
          >
            <Text style={estilos.textoCard}>Consultar Inventario</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={estilos.card}
            onPress={() => navigation.navigate('Alertas')}
          >
            <Text style={estilos.textoCard}>Ver Alertas</Text>
          </TouchableOpacity>
        </View>

        {/* BOTÓN DE CERRAR SESIÓN */}
        <TouchableOpacity style={estilos.botonSalir} onPress={cerrarSesion}>
          <Text style={estilos.textoBotonSalir}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ===============================================
// ESTILOS
// ===============================================
const estilos = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 26,
    color: '#ff6b35',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  tarjetaUsuario: {
    backgroundColor: '#fff7f2',
    borderWidth: 1.5,
    borderColor: '#ffb84d',
    borderRadius: 16,
    padding: 15,
    marginBottom: 25,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  datosUsuario: {
    alignItems: 'center',
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6b35',
  },
  correo: {
    fontSize: 14,
    color: '#777',
  },
  menu: {
    width: '100%',
    gap: 15,
    marginBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#ffb84d',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  textoCard: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },
  botonSalir: {
    backgroundColor: '#e85d2e',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '70%',
    alignItems: 'center',
  },
  textoBotonSalir: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  cargando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
