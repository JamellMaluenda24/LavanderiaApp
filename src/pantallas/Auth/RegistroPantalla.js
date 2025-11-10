
// Pantalla de Registro de Usuario



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

export default function RegistroPantalla({ navigation }) {
  // ------------------- ESTADOS -------------------
  const [nombre, setNombre] = useState(''); 
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);

  // ------------------- FUNCIÓN PRINCIPAL -------------------
  const manejarRegistro = async () => {
    if (!nombre || !correo || !contrasena) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos.');
      return;
    }

    setCargando(true);

    try {
      // Crear el usuario en Firebase Authentication
      const credencial = await auth().createUserWithEmailAndPassword(correo, contrasena);
      const uid = credencial.user.uid;

      // Guardar información adicional en Firestore
      await firestore().collection('usuarios').doc(uid).set({
        nombre: nombre.trim(),
        correo: correo.toLowerCase(),
        creadoEn: firestore.FieldValue.serverTimestamp(),
        rol: 'operario',
        activo: true,
      });

      Alert.alert('Registro exitoso', 'Usuario creado correctamente. Ahora puedes iniciar sesión.');
      navigation.replace('InicioSesion');
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
    } finally {
      setCargando(false);
    }
  };

  // INTERFAZ VISUAL
  return (
    <View style={estilos.fondo}>
      <View style={estilos.tarjeta}>
        <Text style={estilos.titulo}>Crear Cuenta</Text>
        <Text style={estilos.subtitulo}>Regístrate como nuevo operario</Text>

        {/* Campo de nombre completo */}
        <TextInput
          placeholder="Nombre completo (Ej: Juan Pérez)"
          placeholderTextColor="#aaa"
          value={nombre}
          onChangeText={setNombre}
          style={estilos.entrada}
        />

        {/* Campo de correo electrónico */}
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

        {/* Botón principal */}
        <TouchableOpacity
          style={[estilos.botonPrincipal, cargando && { opacity: 0.7 }]}
          onPress={manejarRegistro}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={estilos.textoBoton}>Registrar</Text>
          )}
        </TouchableOpacity>

        {/* Enlace para volver al inicio de sesión */}
        <Text style={estilos.textoInferior}>¿Ya tienes una cuenta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('InicioSesion')}>
          <Text style={estilos.registrate}>Inicia sesión aquí</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ESTILOS
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
