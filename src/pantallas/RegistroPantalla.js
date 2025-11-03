// Pantalla de registro de usuario para la aplicación Lavandería El Cobre
// Permite crear una cuenta usando Firebase Authentication y guarda los datos del usuario en Firestore

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth, firestore } from '../servicios/firebase'; // Importa los servicios de Firebase configurados

export default function RegistroPantalla({ navigation }) {
  // Estados locales para manejar los valores del formulario
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false); // Controla el estado de carga para evitar doble clics

  // Función principal: maneja el proceso de registro
  const manejarRegistro = async () => {
    // Validación básica: evita campos vacíos
    if (!correo || !contrasena) {
      Alert.alert('Campos incompletos', 'Por favor ingresa correo y contraseña.');
      return;
    }

    setCargando(true); // Activa el indicador de carga
    try {
      // Crea el usuario en Firebase Authentication
      const credencial = await auth().createUserWithEmailAndPassword(correo, contrasena);
      const uid = credencial.user.uid; // Obtiene el identificador único del usuario

      // Guarda los datos del usuario en Firestore
      await firestore().collection('usuarios').doc(uid).set({
        correo: correo.toLowerCase(), // Guarda el correo en minúsculas para consistencia
        creadoEn: firestore.FieldValue.serverTimestamp(), // Fecha automática del servidor
        rol: 'operario', // Rol por defecto para nuevos usuarios
        activo: true, // Campo adicional para posibles futuras validaciones
      });

      // Confirmación visual de éxito
      Alert.alert(
        '✅ Registro exitoso',
        'Usuario creado correctamente. Ahora puedes iniciar sesión.'
      );

      // Navega a la pantalla de inicio de sesión
      navigation.replace('InicioSesion');
    } catch (error) {
      console.error('Error al registrar:', error);

      // Manejo de errores comunes en Firebase Authentication
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
      setCargando(false); // Restablece el estado de carga
    }
  };

  // Interfaz visual de la pantalla
  return (
    <View style={estilos.fondo}>
      <View style={estilos.contenedor}>
        <Text style={estilos.titulo}>Registro de Usuario</Text>

        {/* Campo de entrada para el correo electrónico */}
        <TextInput
          placeholder="Correo electrónico"
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={correo}
          onChangeText={setCorreo}
          style={estilos.entrada}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Campo de entrada para la contraseña */}
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={contrasena}
          onChangeText={setContrasena}
          style={estilos.entrada}
          secureTextEntry
        />

        {/* Botón principal de registro */}
        <TouchableOpacity
          style={[estilos.botonPrincipal, cargando && { opacity: 0.5 }]}
          onPress={manejarRegistro}
          disabled={cargando}
        >
          <Text style={estilos.textoBoton}>
            {cargando ? 'Registrando...' : 'Registrar'}
          </Text>
        </TouchableOpacity>

        {/* Botón secundario para volver al inicio de sesión */}
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

// Estilos de la interfaz visual
const estilos = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: '#ff6b35', // Color principal (naranja estilo Cobreloa)
  },
  contenedor: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    backgroundColor: 'rgba(0,0,0,0.25)', // Capa con transparencia para contraste
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
    borderColor: '#ffb84d', // Color dorado para bordes
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.15)', // Fondo translúcido
  },
  botonPrincipal: {
    backgroundColor: '#e85d2e', // Naranja más oscuro
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
