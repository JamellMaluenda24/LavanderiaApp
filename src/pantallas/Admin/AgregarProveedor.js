
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  FlatList,
} from 'react-native';
import { firestore } from '../../servicios/firebase';

export default function AgregarProveedor() {

  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [correo, setCorreo] = useState('');

  const [historial, setHistorial] = useState([]);

  const registrarProveedor = async () => {

    if (!nombre || !telefono || !direccion || !ciudad) {
      Alert.alert('Error', 'Debes completar todos los campos obligatorios.');
      return;
    }

    try {
      const nuevoProveedor = {
        nombre,
        telefono,
        direccion,
        ciudad,
        correo,
        fechaRegistro: new Date().toLocaleDateString(),
      };

      await firestore().collection('proveedores').add(nuevoProveedor);

      setHistorial(prev => [...prev, { id: Date.now().toString(), ...nuevoProveedor }]);

      Alert.alert('Éxito', `Proveedor "${nombre}" registrado correctamente.`);

      setNombre('');
      setTelefono('');
      setDireccion('');
      setCiudad('');
      setCorreo('');
    } catch (error) {
      console.error('Error al registrar proveedor:', error);
      Alert.alert('Error', 'Ocurrió un problema al registrar el proveedor.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.titulo}>Agregar Proveedor</Text>


      <Text style={styles.label}>Nombre del proveedor *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Proveedor Local"
        value={nombre}
        onChangeText={setNombre}
      />


      <Text style={styles.label}>Ciudad *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Santiago"
        value={ciudad}
        onChangeText={setCiudad}
      />


      <Text style={styles.label}>Dirección *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Calle Falsa 123"
        value={direccion}
        onChangeText={setDireccion}
      />


      <Text style={styles.label}>Teléfono *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: +56912345678"
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
      />


      <Text style={styles.label}>Correo electrónico (opcional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: proveedor@email.com"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
      />


      <TouchableOpacity style={styles.boton} onPress={registrarProveedor}>
        <Text style={styles.textoBoton}>Guardar Proveedor</Text>
      </TouchableOpacity>


      <Text style={styles.subtitulo}>Proveedores agregados esta sesión</Text>

      {historial.length === 0 ? (
        <Text style={styles.noHistorial}>No hay proveedores registrados aún.</Text>
      ) : (
        <FlatList
          data={historial}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.historialItem}>
              <Text style={styles.historialTexto}>
                {item.fechaRegistro} - {item.nombre} ({item.telefono}) - {item.direccion}, {item.ciudad}
              </Text>
            </View>
          )}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff5ee',
    flexGrow: 1,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e85d2e',
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#e85d2e',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
  },
  boton: {
    backgroundColor: '#e85d2e',
    borderRadius: 12,
    paddingVertical: 15,
    marginVertical: 20,
    alignItems: 'center',
  },
  textoBoton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e85d2e',
    marginBottom: 10,
  },
  noHistorial: {
    fontSize: 16,
    color: '#333',
    fontStyle: 'italic',
  },
  historialItem: {
    backgroundColor: '#ffebd6',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  historialTexto: {
    fontSize: 15,
    color: '#333',
  },
});
