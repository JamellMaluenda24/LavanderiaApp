// Pantalla principal del administrador
// Verifica el rol del usuario autenticado antes de mostrar el panel.
// Si no es administrador, lo redirige a la pantalla principal (Inicio).

import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { auth, firestore } from '../servicios/firebase';

export default function AdminPantalla({ navigation }) {
  const [cargando, setCargando] = useState(true); // Estado para mostrar un indicador mientras se verifica el rol
  const [esAdmin, setEsAdmin] = useState(false); // Indica si el usuario es administrador
  const usuario = auth().currentUser; // Usuario autenticado actualmente

  //  useEffect: se ejecuta al montar la pantalla para validar el rol del usuario
  useEffect(() => {
    const verificarRol = async () => {
      try {
        if (!usuario) {
          Alert.alert('Sesión inválida', 'Debes iniciar sesión nuevamente.');
          navigation.replace('InicioSesion');
          return;
        }

        //  Obtiene los datos del usuario desde Firestore
        const docUsuario = await firestore().collection('usuarios').doc(usuario.uid).get();

        if (docUsuario.exists) {
          const datos = docUsuario.data();

          //  Verifica si el rol es 'admin'
          if (datos.rol === 'admin') {
            setEsAdmin(true);
          } else {
            Alert.alert('Acceso restringido', 'No tienes permisos de administrador.');
            navigation.replace('Inicio'); // Redirige a la pantalla de inicio normal
          }
        } else {
          Alert.alert('Error', 'No se encontraron datos del usuario en la base de datos.');
          navigation.replace('InicioSesion');
        }
      } catch (error) {
        console.error('Error al verificar el rol del usuario:', error);
        Alert.alert('Error', 'Ocurrió un problema al verificar tu rol.');
        navigation.replace('InicioSesion');
      } finally {
        setCargando(false);
      }
    };

    verificarRol();
  }, []);

  //  Cierra la sesión del usuario
  const cerrarSesion = async () => {
    await auth().signOut();
    navigation.replace('InicioSesion');
  };

  //  Muestra un indicador mientras se valida el rol
  if (cargando) {
    return (
      <View style={estilos.contenedor}>
        <ActivityIndicator size="large" color="#ff6b35" />
        <Text style={estilos.texto}>Verificando permisos...</Text>
      </View>
    );
  }

  //  Muestra el panel solo si el usuario es administrador
  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Panel de Administración</Text>
      <Text style={estilos.texto}>Bienvenido, {usuario?.email}</Text>

      <Button title="Cerrar sesión" color="#e85d2e" onPress={cerrarSesion} />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff5ee',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e85d2e',
    marginBottom: 20,
  },
  texto: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
});
