// Pantalla de Inicio de Sesión
// Permite al usuario ingresar con correo y contraseña.
// Valida la autenticación con Firebase Authentication y
// redirige según el rol del usuario en Firestore (admin u operario).

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { auth, firestore } from '../servicios/firebase';

export default function InicioSesionPantalla({ navigation }) {
  //  Estados locales
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);

  //  Función principal: manejo del inicio de sesión
  const manejarInicioSesion = async () => {
    if (!correo || !contrasena) {
      Alert.alert('Campos incompletos', 'Por favor ingresa correo y contraseña.');
      return;
    }

    setCargando(true);
    try {
      // 1️ Autentica al usuario en Firebase Authentication
      const credenciales = await auth().signInWithEmailAndPassword(correo, contrasena);
      const uid = credenciales.user.uid;

      // 2️ Busca el usuario en Firestore
      const docUsuario = await firestore().collection('usuarios').doc(uid).get();

      if (!docUsuario.exists) {
        Alert.alert(
          ' Usuario no registrado',
          'Tu cuenta no está registrada en la base de datos. Contacta con el administrador.'
        );
        await auth().signOut();
        return;
      }

      const datos = docUsuario.data();

      // 3️ Verifica si el usuario está activo
      if (datos.activo === false) {
        Alert.alert('Cuenta inactiva', 'Tu usuario ha sido desactivado por un administrador.');
        await auth().signOut();
        return;
      }

      // 4️ Redirige según el rol del usuario
      if (datos.rol === 'admin') {
        Alert.alert('Bienvenido Administrador', 'Accediendo al panel de administración...');
        navigation.replace('Admin'); // 🧭 Redirige al panel admin
      } else {
        Alert.alert('Bienvenido Operario', 'Inicio de sesión correcto.');
        navigation.replace('Inicio'); // 👷 Redirige a la interfaz de operario
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);

      //  Manejo de errores específicos de Firebase
      if (error?.code) {
        switch (error.code) {
          case 'auth/invalid-email':
            Alert.alert('Error', 'El correo no es válido.');
            break;
          case 'auth/user-not-found':
            Alert.alert('Error', 'Usuario no encontrado.');
            break;
          case 'auth/wrong-password':
            Alert.alert('Error', 'Contraseña incorrecta.');
            break;
          default:
            Alert.alert('Error', error.message);
        }
      } else {
        Alert.alert('Error', 'Ocurrió un problema al iniciar sesión.');
      }
    } finally {
      setCargando(false);
    }
  };

  //  Interfaz visual
  return (
    <View style={estilos.fondo}>
      <View style={estilos.contenedor}>
        <Text style={estilos.titulo}>Lavandería El Cobre</Text>

        {/* Campo de correo */}
        <TextInput
          placeholder="Correo electrónico"
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={correo}
          onChangeText={setCorreo}
          style={estilos.entrada}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Campo de contraseña */}
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={contrasena}
          onChangeText={setContrasena}
          style={estilos.entrada}
          secureTextEntry
        />

        {/* Botón principal */}
        <TouchableOpacity
          style={[estilos.botonPrincipal, cargando && { opacity: 0.5 }]}
          onPress={manejarInicioSesion}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={estilos.textoBoton}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>

        {/* Enlace al registro */}
        <TouchableOpacity
          style={estilos.botonSecundario}
          onPress={() => navigation.navigate('Registro')}
        >
          <Text style={estilos.textoBotonSecundario}>¿No tienes cuenta? Regístrate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Estilos visuales
const estilos = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: '#ff6b35', // Naranja Cobreloa
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
    marginBottom: 40,
  },
  entrada: {
    borderWidth: 1.5,
    borderColor: '#ffb84d', // Dorado
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  botonPrincipal: {
    backgroundColor: '#e85d2e',
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 15,
  },
  textoBoton: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botonSecundario: {
    borderWidth: 1.5,
    borderColor: '#ffb84d',
    borderRadius: 12,
    paddingVertical: 12,
  },
  textoBotonSecundario: {
    textAlign: 'center',
    color: '#ffb84d',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
