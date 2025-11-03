// Pantalla: Registro de Consumo
// Esta pantalla permite registrar el consumo de insumos en los diferentes procesos de la lavandería.
// Los datos se guardan en la colección "consumos" de Firestore, junto con el usuario autenticado y la fecha del registro.

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { firestore, auth } from '../servicios/firebase';

export default function RegistroConsumoPantalla({ navigation }) {
  // Estados locales para manejar los campos del formulario
  const [proceso, setProceso] = useState('');   // Nombre del proceso (ej. Lavado, Planchado)
  const [insumo, setInsumo] = useState('');     // Nombre del insumo utilizado
  const [cantidad, setCantidad] = useState(''); // Cantidad de insumo usado

  // Función para registrar el consumo en Firestore
  const registrarConsumo = async () => {
    // Validación básica: todos los campos deben estar completos
    if (!proceso || !insumo || !cantidad) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    try {
      // Obtiene el usuario actual autenticado
      const usuario = auth().currentUser;

      // Agrega un nuevo documento en la colección "consumos"
      await firestore().collection('consumos').add({
        proceso,
        insumo,
        cantidad: Number(cantidad), // Se asegura de guardar la cantidad como número
        fecha: new Date(),          // Fecha actual
        usuario: usuario?.email || 'desconocido', // Guarda el correo del usuario o "desconocido"
      });

      // Notifica al usuario que el registro fue exitoso
      Alert.alert('Registro exitoso', 'El consumo ha sido registrado correctamente.');

      // Limpia los campos del formulario
      setProceso('');
      setInsumo('');
      setCantidad('');
    } catch (error) {
      console.error('Error al registrar consumo:', error);
      Alert.alert('Error', 'No se pudo registrar el consumo.');
    }
  };

  // Interfaz visual de la pantalla
  return (
    <ScrollView contentContainerStyle={estilos.fondo}>
      <View style={estilos.contenedor}>
        <Text style={estilos.titulo}>Registro de Consumo</Text>

        {/* Campo de entrada para el proceso */}
        <TextInput
          placeholder="Proceso (Lavado, Planchado, etc.)"
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={proceso}
          onChangeText={setProceso}
          style={estilos.entrada}
        />

        {/* Campo de entrada para el insumo */}
        <TextInput
          placeholder="Insumo utilizado"
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={insumo}
          onChangeText={setInsumo}
          style={estilos.entrada}
        />

        {/* Campo de entrada para la cantidad */}
        <TextInput
          placeholder="Cantidad usada"
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={cantidad}
          onChangeText={setCantidad}
          style={estilos.entrada}
          keyboardType="numeric"
        />

        {/* Botón para registrar el consumo */}
        <TouchableOpacity style={estilos.botonPrincipal} onPress={registrarConsumo}>
          <Text style={estilos.textoBoton}>Registrar Consumo</Text>
        </TouchableOpacity>

        {/* Botón para volver a la pantalla anterior */}
        <TouchableOpacity
          style={estilos.botonSecundario}
          onPress={() => navigation.goBack()}
        >
          <Text style={estilos.textoBotonSecundario}>Volver</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Estilos de la pantalla
const estilos = StyleSheet.create({
  fondo: {
    flexGrow: 1,
    backgroundColor: '#ff6b35', // Fondo naranja principal
    justifyContent: 'center',
    paddingVertical: 40,
  },
  contenedor: {
    backgroundColor: 'rgba(0,0,0,0.25)', // Fondo con transparencia para contraste
    borderRadius: 16,
    padding: 30,
    marginHorizontal: 25,
  },
  titulo: {
    fontSize: 26,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  entrada: {
    borderWidth: 1.5,
    borderColor: '#ffb84d', // Borde dorado
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
