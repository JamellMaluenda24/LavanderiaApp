

// src/pantallas/ReportesInsumos.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function ReportesInsumos({ navigation }) {
  
  // Función de ejemplo para generar reporte
  const generarReporte = (tipo) => {
    Alert.alert('Reporte generado', `Se generó el reporte ${tipo} de insumos.`);

  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>📊 Reportes de Insumos</Text>
      <Text style={styles.subtitulo}>Selecciona el tipo de reporte:</Text>

      <TouchableOpacity
        style={[styles.boton, { backgroundColor: '#e85d2e' }]}
        onPress={() => generarReporte('semanal')}
      >
        <Text style={styles.textoBoton}>📆 Reporte Semanal</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.boton, { backgroundColor: '#ffb84d' }]}
        onPress={() => generarReporte('mensual')}
      >
        <Text style={styles.textoBoton}>🗓️ Reporte Mensual</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff5ee',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e85d2e',
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 16,
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  boton: {
    width: '80%',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 10,
  },
  textoBoton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
