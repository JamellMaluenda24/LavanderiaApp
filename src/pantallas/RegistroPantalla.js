import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth, firestore } from '../servicios/firebase';

export default function RegistroPantalla({ navigation }) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');

  const manejarRegistro = async () => {
    try {
      const credencial = await auth().createUserWithEmailAndPassword(correo, contrasena);
      await firestore().collection('usuarios').doc(credencial.user.uid).set({
        correo,
        creadoEn: new Date(),
        rol: 'operario',
      });
      Alert.alert('✅ Registro exitoso', 'Usuario creado correctamente.');
      navigation.replace('Inicio');
    } catch (error) {
      console.error('Error al registrar:', error);
      if (error?.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            Alert.alert('Error', 'El correo ya está en uso.');
            break;
          case 'auth/invalid-email':
            Alert.alert('Error', 'Correo inválido.');
            break;
          case 'auth/weak-password':
            Alert.alert('Error', 'La contraseña es demasiado débil.');
            break;
          default:
            Alert.alert('Error', error.message);
        }
      } else {
        Alert.alert('Error', 'Ocurrió un problema al registrarse.');
      }
    }
  };

  return (
    <View style={estilos.fondo}>
      <View style={estilos.contenedor}>
        <Text style={estilos.titulo}>Registro de Usuario</Text>

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

        <TouchableOpacity style={estilos.botonPrincipal} onPress={manejarRegistro}>
          <Text style={estilos.textoBoton}>Registrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={estilos.botonSecundario}
          onPress={() => navigation.navigate('InicioSesion')}
        >
          <Text style={estilos.textoBotonSecundario}>Volver al inicio</Text>
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
    backgroundColor: 'rgba(0,0,0,0.25)', // Transparencia sutil
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
