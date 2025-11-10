// Pantalla de Registro de Consumo
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { firestore, auth } from '../../servicios/firebase';

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

      Alert.alert('Registro exitoso', 'El consumo ha sido registrado correctamente.');
      setProceso('');
      setInsumo('');
      setCantidad('');
    } catch (error) {
      console.error('Error al registrar consumo:', error);
      Alert.alert('Error', 'No se pudo registrar el consumo.');
    }
  };


  return (
    <SafeAreaView style={estilos.safeArea}>
      <ScrollView contentContainerStyle={estilos.container}>
        {/* Título principal */}
        <Text style={estilos.titulo}>Registro de Consumo</Text>

        {/* Campo: Proceso */}
        <TextInput
          placeholder="Proceso (Lavado, Planchado, etc.)"
          placeholderTextColor="#999"
          value={proceso}
          onChangeText={setProceso}
          style={estilos.input}
        />

        {/* Campo: Insumo */}
        <TextInput
          placeholder="Insumo utilizado"
          placeholderTextColor="#999"
          value={insumo}
          onChangeText={setInsumo}
          style={estilos.input}
        />

        {/* Campo: Cantidad */}
        <TextInput
          placeholder="Cantidad usada"
          placeholderTextColor="#999"
          value={cantidad}
          onChangeText={setCantidad}
          keyboardType="numeric"
          style={estilos.input}
        />

        {/* Botón: Registrar */}
        <TouchableOpacity style={estilos.botonRegistrar} onPress={registrarConsumo}>
          <Text style={estilos.textoBotonRegistrar}>Registrar Consumo</Text>
        </TouchableOpacity>

        {/* Botón: Volver */}
        <TouchableOpacity
          style={estilos.botonVolver}
          onPress={() => navigation.goBack()}
        >
          <Text style={estilos.textoBotonVolver}>Volver</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff5ee', 
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#fff5ee',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e85d2e',
    textAlign: 'center',
    marginBottom: 25,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e85d2e66',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
    color: '#333',
  },
  botonRegistrar: {
    backgroundColor: '#e85d2e',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 5,
  },
  textoBotonRegistrar: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  botonVolver: {
    borderWidth: 1.5,
    borderColor: '#e85d2e',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 20,
    marginBottom: 30,
  },
  textoBotonVolver: {
    textAlign: 'center',
    color: '#e85d2e',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
