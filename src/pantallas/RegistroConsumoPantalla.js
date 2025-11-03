import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { firestore, auth } from '../servicios/firebase';

export default function RegistroConsumoPantalla({ navigation }) {
  const [proceso, setProceso] = useState('');
  const [insumo, setInsumo] = useState('');
  const [cantidad, setCantidad] = useState('');

  const registrarConsumo = async () => {
    if (!proceso || !insumo || !cantidad) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    try {
      const usuario = auth().currentUser;
      await firestore().collection('consumos').add({
        proceso,
        insumo,
        cantidad: Number(cantidad),
        fecha: new Date(),
        usuario: usuario?.email || 'desconocido',
      });

      Alert.alert('✅ Registro exitoso', 'El consumo ha sido registrado correctamente.');
      setProceso('');
      setInsumo('');
      setCantidad('');
    } catch (error) {
      console.error('Error al registrar consumo:', error);
      Alert.alert('Error', 'No se pudo registrar el consumo.');
    }
  };

  return (
    <ScrollView contentContainerStyle={estilos.fondo}>
      <View style={estilos.contenedor}>
        <Text style={estilos.titulo}>Registro de Consumo</Text>

        <TextInput
          placeholder="Proceso (Lavado, Planchado, etc.)"
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={proceso}
          onChangeText={setProceso}
          style={estilos.entrada}
        />

        <TextInput
          placeholder="Insumo utilizado"
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={insumo}
          onChangeText={setInsumo}
          style={estilos.entrada}
        />

        <TextInput
          placeholder="Cantidad usada"
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={cantidad}
          onChangeText={setCantidad}
          style={estilos.entrada}
          keyboardType="numeric"
        />

        <TouchableOpacity style={estilos.botonPrincipal} onPress={registrarConsumo}>
          <Text style={estilos.textoBoton}>Registrar Consumo</Text>
        </TouchableOpacity>

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

const estilos = StyleSheet.create({
  fondo: {
    flexGrow: 1,
    backgroundColor: '#ff6b35',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  contenedor: {
    backgroundColor: 'rgba(0,0,0,0.25)',
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
    borderColor: '#ffb84d',
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
