import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth } from '../servicios/firebase';

export default function InicioSesionPantalla({ navigation }) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');

  const manejarInicioSesion = async () => {
    try {
      await auth().signInWithEmailAndPassword(correo, contrasena);
      Alert.alert('✅ Bienvenido', 'Inicio de sesión correcto.');
      navigation.replace('Inicio');
    } catch (error) {
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
    }
  };

  return (
    <View style={estilos.fondo}>
      <View style={estilos.contenedor}>
        <Text style={estilos.titulo}>Lavandería El Cobre</Text>

        <TextInput
          placeholder="Correo electrónico"
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={correo}
          onChangeText={setCorreo}
          style={estilos.entrada}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={contrasena}
          onChangeText={setContrasena}
          style={estilos.entrada}
          secureTextEntry
        />

        <TouchableOpacity style={estilos.botonPrincipal} onPress={manejarInicioSesion}>
          <Text style={estilos.textoBoton}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={estilos.botonSecundario}
          onPress={() => navigation.navigate('Registro')}
        >
          <Text style={estilos.textoBotonSecundario}>Registrarse</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: '#ff6b35', // Naranja Cobreloa
  },
  contenedor: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    backgroundColor: 'rgba(0,0,0,0.25)', // Transparencia ligera
  },
  titulo: {
    fontSize: 30,
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
    backgroundColor: '#e85d2e', // Naranja oscuro
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
