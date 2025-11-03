import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { auth } from '../servicios/firebase'; // ajusta si tu carpeta de firebase se llama distinto

export default function AdminPantalla({ navigation }) {
  const usuario = auth().currentUser;

  const cerrarSesion = async () => {
    await auth().signOut();
    navigation.replace('Login');
  };

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Panel de Administración</Text>
      <Text style={estilos.texto}>Bienvenido, {usuario?.email}</Text>

      <Button title="Cerrar sesión" onPress={cerrarSesion} />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  texto: {
    fontSize: 16,
    marginBottom: 20,
  },
});
