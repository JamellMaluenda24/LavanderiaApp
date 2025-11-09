import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';

export default function ReportesInsumos({ navigation }) {
  
  // Función de ejemplo para generar reporte
  const generarReporte = () => {
    Alert.alert('Reporte', 'Se generó el reporte de insumos.');
    // Aquí luego puedes integrar la lógica de PDF o Firebase
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Reportes de Insumos</Text>
      <Text style={styles.subtitulo}>Selecciona el tipo de reporte:</Text>

      <View style={styles.botonContainer}>
        <Button title="Reporte semanal" onPress={generarReporte} color="#e85d2e" />
      </View>
      <View style={styles.botonContainer}>
        <Button title="Reporte mensual" onPress={generarReporte} color="#ffb84d" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#e85d2e', marginBottom: 20 },
  subtitulo: { fontSize: 16, color: '#333', marginBottom: 20 },
  botonContainer: { marginVertical: 10, width: '80%' },
});
