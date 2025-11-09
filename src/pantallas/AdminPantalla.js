// Pantalla principal del administrador
// Verifica el rol del usuario autenticado antes de mostrar el panel.

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { auth, firestore } from '../servicios/firebase';

export default function AdminPantalla({ navigation }) {
  const [cargando, setCargando] = useState(true);
  const [esAdmin, setEsAdmin] = useState(false);
  const usuario = auth().currentUser;

  useEffect(() => {
    const verificarRol = async () => {
      try {
        if (!usuario) {
          Alert.alert('Sesión inválida', 'Debes iniciar sesión nuevamente.');
          navigation.replace('InicioSesion');
          return;
        }

        const docUsuario = await firestore().collection('usuarios').doc(usuario.uid).get();

        if (docUsuario.exists) {
          const datos = docUsuario.data();
          if (datos.rol === 'admin') {
            setEsAdmin(true);
          } else {
            Alert.alert('Acceso restringido', 'No tienes permisos de administrador.');
            navigation.replace('Inicio');
          }
        } else {
          Alert.alert('Error', 'No se encontraron datos del usuario.');
          navigation.replace('InicioSesion');
        }
      } catch (error) {
        console.error('Error al verificar rol:', error);
        Alert.alert('Error', 'Ocurrió un problema al verificar tu rol.');
        navigation.replace('InicioSesion');
      } finally {
        setCargando(false);
      }
    };

    verificarRol();
  }, []);

  const cerrarSesion = async () => {
    try {
      await auth().signOut();
      navigation.replace('InicioSesion');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert('Error', 'No se pudo cerrar sesión. Intenta nuevamente.');
    }
  };

  if (cargando) {
    return (
      <View style={estilos.contenedor}>
        <ActivityIndicator size="large" color="#e85d2e" />
        <Text style={estilos.texto}>Verificando permisos...</Text>
      </View>
    );
  }

  if (!esAdmin) return null; // No mostrar nada si no es admin (ya redirige en useEffect)

  return (
    <ScrollView contentContainerStyle={estilos.contenedor}>
      <Text style={estilos.titulo}>Panel de Administración</Text>
      <Text style={estilos.texto}>Bienvenido, {usuario?.email}</Text>

      <View style={estilos.menu}>
        {/* Botones principales */}

        <TouchableOpacity style={estilos.boton} onPress={() => navigation.navigate('InventarioAdmin')}>
          <Text style={estilos.textoBoton}>Inventario de insumos</Text>
        </TouchableOpacity>


        <TouchableOpacity style={estilos.boton} onPress={() => navigation.navigate('ReportesInsumos')}>
          <Text style={estilos.textoBoton}>Generar Reportes Semanales/Mensuales</Text>
        </TouchableOpacity>

        <TouchableOpacity style={estilos.boton} onPress={() => navigation.navigate('ListaProveedores')}>
          <Text style={estilos.textoBoton}>Lista de Proveedores</Text>
        </TouchableOpacity>

        <TouchableOpacity style={estilos.boton} onPress={() => navigation.navigate('AprobarPedidos')}>
          <Text style={estilos.textoBoton}>Aprobar / Rechazar Pedidos</Text>
        </TouchableOpacity>

        {/* Botón de cerrar sesión */}
        <TouchableOpacity style={estilos.botonSalir} onPress={cerrarSesion}>
          <Text style={estilos.textoBotonSalir}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff5ee',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e85d2e',
    marginBottom: 15,
  },
  texto: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  menu: {
    width: '100%',
    gap: 12,
    marginBottom: 20,
  },
  boton: {
    backgroundColor: '#e85d2e',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  textoBoton: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  botonSalir: {
    borderWidth: 1.5,
    borderColor: '#e85d2e',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 10,
  },
  textoBotonSalir: {
    color: '#e85d2e',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
