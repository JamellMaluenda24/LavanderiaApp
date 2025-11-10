
// Pantalla de Inicio de Sesión

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
import { auth, firestore } from '../../servicios/firebase';

export default function InicioSesionPantalla({ navigation }) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false); 


  // Maneja el inicio de sesión con Firebase
  const manejarInicioSesion = async () => {
    if (!correo || !contrasena) {
      Alert.alert('Campos incompletos', 'Por favor ingresa correo y contraseña.');
      return;
    }

    setCargando(true); // Muestra spinner mientras se valida

    try {
      // Inicia sesión con Firebase Authentication
      const credenciales = await auth().signInWithEmailAndPassword(correo, contrasena);
      const uid = credenciales.user.uid; // ID único del usuario

      // Busca los datos del usuario en Firestore
      const docUsuario = await firestore().collection('usuarios').doc(uid).get();

      // Si no existe en la base de datos
      if (!docUsuario.exists) {
        Alert.alert(
          'Usuario no registrado',
          'Tu cuenta no está registrada en la base de datos. Contacta con el administrador.'
        );
        await auth().signOut();
        return;
      }

      const datos = docUsuario.data();

      // Verifica si la cuenta está activa
      if (datos.activo === false) {
        Alert.alert('Cuenta inactiva', 'Tu usuario ha sido desactivado por un administrador.');
        await auth().signOut();
        return;
      }

      // Redirección según el rol del usuario
      if (datos.rol === 'admin') {
        Alert.alert('Bienvenido Administrador', 'Accediendo al panel de administración...');
        navigation.replace('Admin');
      } else {
        Alert.alert('Bienvenido Operario', 'Inicio de sesión correcto.');
        navigation.replace('Inicio');
      }
    } catch (error) {
      // Manejo de errores comunes de Firebase
      console.error('Error al iniciar sesión:', error);

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
      setCargando(false); // Oculta el spinner
    }
  };

  //INTERFAZ VISUAL
  return (
    <View style={estilos.fondo}>
      {/* Contenedor tipo tarjeta blanca */}
      <View style={estilos.tarjeta}>

        {/* Título principal */}
        <Text style={estilos.titulo}>Bienvenido</Text>
        <Text style={estilos.subtitulo}>Ingresa a tu cuenta</Text>

        {/* Campo de correo */}
        <TextInput
          placeholder="usuario@ejemplo.com"
          placeholderTextColor="#aaa"
          value={correo}
          onChangeText={setCorreo}
          style={estilos.entrada}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Campo de contraseña */}
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#aaa"
          value={contrasena}
          onChangeText={setContrasena}
          style={estilos.entrada}
          secureTextEntry
        />

        {/* Línea con “Recordarme” y “¿Olvidaste tu contraseña?” */}
        <View style={estilos.fila}>
          <Text style={estilos.textoRecordarme}>Recordarme</Text>

          {/* Aquí se puede agregar una función futura para recuperar contraseña */}
          <TouchableOpacity>
            <Text style={estilos.textoOlvido}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </View>

        {/* Botón principal */}
        <TouchableOpacity
          style={[estilos.botonPrincipal, cargando && { opacity: 0.7 }]}
          onPress={manejarInicioSesion}
          disabled={cargando}
        >
          {/* Muestra el spinner mientras carga */}
          {cargando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={estilos.textoBoton}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>

        {/* Enlace para registrarse */}
        <Text style={estilos.textoInferior}>¿No tienes cuenta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
          <Text style={estilos.registrate}>Regístrate como Operario</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: '#f35b24', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  tarjeta: {
    backgroundColor: '#fff', 
    width: '85%',
    borderRadius: 16,
    paddingVertical: 30,
    paddingHorizontal: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  titulo: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f35b24',
  },
  subtitulo: {
    textAlign: 'center',
    fontSize: 14,
    color: '#777',
    marginBottom: 25,
  },
  entrada: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  textoRecordarme: {
    color: '#555',
    fontSize: 13,
  },
  textoOlvido: {
    color: '#f35b24',
    fontSize: 13,
  },
  botonPrincipal: {
    backgroundColor: '#f35b24',
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 15,
  },
  textoBoton: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textoInferior: {
    textAlign: 'center',
    color: '#555',
    fontSize: 14,
  },
  registrate: {
    textAlign: 'center',
    color: '#f35b24',
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 5,
  },
});
