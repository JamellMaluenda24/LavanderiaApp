// Pantalla de Inicio admin

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { auth, firestore } from '../../servicios/firebase';

export default function AdminPantalla({ navigation }) {
  const [cargando, setCargando] = useState(true);
  const [esAdmin, setEsAdmin] = useState(false);
  const [usuarioDatos, setUsuarioDatos] = useState(null);

  useEffect(() => {
    const verificarRol = async () => {
      try {
        const usuario = auth().currentUser;
        if (!usuario) {
          Alert.alert('Sesión inválida', 'Debes iniciar sesión nuevamente.');
          navigation.replace('InicioSesion');
          return;
        }

        const docUsuario = await firestore().collection('usuarios').doc(usuario.uid).get();

        if (docUsuario.exists) {
          const datos = docUsuario.data();
          setUsuarioDatos(datos);

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
      Alert.alert('Sesión cerrada', 'Has cerrado sesión correctamente.');
      navigation.replace('InicioSesion');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert('Error', 'No se pudo cerrar sesión. Intenta nuevamente.');
    }
  };

  if (cargando) {
    return (
      <View style={estilos.cargando}>
        <ActivityIndicator size="large" color="#ff6b35" />
        <Text style={{ color: '#777', marginTop: 10 }}>Verificando permisos...</Text>
      </View>
    );
  }

  if (!esAdmin) return null;

  return (
    <SafeAreaView style={estilos.fondo}>
      <ScrollView contentContainerStyle={estilos.scroll}>
        <Text style={estilos.titulo}>Panel de Administración</Text>

        {/* Información del administrador */}
        <View style={estilos.tarjetaUsuario}>
          <Text style={estilos.nombre}>{usuarioDatos?.nombre || 'Administrador'}</Text>
          <Text style={estilos.correo}>{usuarioDatos?.correo}</Text>
        </View>

        {/* MENÚ PRINCIPAL */}
        <View style={estilos.menu}>
          <TouchableOpacity
            style={estilos.card}
            onPress={() => navigation.navigate('InventarioAdmin')}
          >
            <Text style={estilos.textoCard}>Inventario de Insumos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={estilos.card}
            onPress={() => navigation.navigate('ReportesInsumos')}
          >
            <Text style={estilos.textoCard}>Generar Reportes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={estilos.card}
            onPress={() => navigation.navigate('ListaProveedores')}
          >
            <Text style={estilos.textoCard}>Lista de Proveedores</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={estilos.card}
            onPress={() => navigation.navigate('AgregarPedidos')}
          >
            <Text style={estilos.textoCard}>Agregar Pedido</Text>
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
