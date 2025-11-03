// Pantalla principal del operario — InicioPantalla.tsx
// Muestra el menú principal y permite cerrar sesión correctamente.

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth } from '../servicios/firebase';

export default function InicioPantalla({ navigation }) {
  const usuario = auth().currentUser;

  //  Cierra la sesión y redirige al menú de login
  const cerrarSesion = async () => {
    try {
      await auth().signOut(); // Cierra sesión en Firebase
      Alert.alert('Sesión cerrada', 'Has cerrado sesión correctamente.');

      //  Reinicia la navegación para evitar volver con "atrás"
      navigation.reset({
        index: 0,
        routes: [{ name: 'InicioSesion' }], // 🔹 Asegúrate de que el nombre coincide con tu pantalla de login
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert('Error', 'No se pudo cerrar sesión. Intenta nuevamente.');
    }
  };

  return (
    <View style={estilos.fondo}>
      <View style={estilos.contenedor}>
        <Text style={estilos.titulo}>¡Bienvenido!</Text>
        <Text style={estilos.subtitulo}>{usuario?.email}</Text>

        <View style={estilos.menu}>
          <TouchableOpacity
            style={estilos.boton}
            onPress={() => navigation.navigate('RegistroConsumo')}
          >
            <Text style={estilos.textoBoton}>Registrar Consumo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={estilos.boton}
            onPress={() => navigation.navigate('Inventario')}
          >
            <Text style={estilos.textoBoton}>Consultar Inventario</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={estilos.boton}
            onPress={() => navigation.navigate('Alertas')}
          >
            <Text style={estilos.textoBoton}>Ver Alertas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={estilos.botonSalir} onPress={cerrarSesion}>
            <Text style={estilos.textoBotonSalir}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: '#ff6b35', // Naranja principal
    justifyContent: 'center',
    alignItems: 'center',
  },
  contenedor: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 30,
    width: '85%',
  },
  titulo: {
    fontSize: 28,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  subtitulo: {
    fontSize: 16,
    textAlign: 'center',
    color: '#ffb84d',
    marginBottom: 30,
  },
  menu: {
    gap: 15,
  },
  boton: {
    backgroundColor: '#e85d2e',
    borderRadius: 12,
    paddingVertical: 15,
  },
  textoBoton: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  botonSalir: {
    borderWidth: 1.5,
    borderColor: '#ffb84d',
    borderRadius: 12,
    paddingVertical: 15,
    marginTop: 10,
  },
  textoBotonSalir: {
    color: '#ffb84d',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});