// Pantalla de Editar Proveedor (admin) 

import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  Alert, ScrollView, ActivityIndicator 
} from 'react-native';
import { firestore } from '../../servicios/firebase';

export default function EditarProveedor({ route, navigation }) {
  const { proveedorId } = route.params || {}; 

  const [nombre, setNombre] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!proveedorId) {
      Alert.alert('Error', 'No se recibió el ID del proveedor.');
      navigation.goBack();
      return;
    }

    const obtenerProveedor = async () => {
      try {
        const docSnap = await firestore().collection('proveedores').doc(proveedorId).get();

        if (docSnap.exists) {
          const data = docSnap.data();
          setNombre(data.nombre || '');
          setCiudad(data.ciudad || '');
          setDireccion(data.direccion || '');
          setTelefono(data.telefono || '');
          setCorreo(data.correo || '');
        } else {
          Alert.alert('Error', 'Proveedor no encontrado en la base de datos.');
          navigation.goBack();
        }
      } catch (error) {
        console.error('Error al obtener proveedor:', error);
        Alert.alert('Error', 'Ocurrió un problema al cargar la información.');
        navigation.goBack();
      } finally {
        setCargando(false);
      }
    };

    obtenerProveedor();
  }, [proveedorId]);

  const guardarCambios = async () => {
    if (!nombre || !ciudad || !direccion || !telefono) {
      Alert.alert('Error', 'Debes completar todos los campos obligatorios.');
      return;
    }

    try {
      await firestore().collection('proveedores').doc(proveedorId).set(
        { nombre, ciudad, direccion, telefono, correo },
        { merge: true } 
      );

      Alert.alert('Éxito', 'Proveedor actualizado correctamente.');
      navigation.goBack();
    } catch (error) {
      console.error('Error al actualizar proveedor:', error);
      Alert.alert('Error', 'No se pudo actualizar el proveedor.');
    }
  };

  if (cargando) {
    return (
      <View style={[styles.contenedor, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#e85d2e" />
        <Text style={styles.texto}>Cargando información...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.contenedor}>
      <Text style={styles.titulo}>Editar Proveedor</Text>

      <Text style={styles.label}>Nombre *</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Nombre del proveedor"
      />

      <Text style={styles.label}>Ciudad *</Text>
      <TextInput
        style={styles.input}
        value={ciudad}
        onChangeText={setCiudad}
        placeholder="Ciudad"
      />

      <Text style={styles.label}>Dirección *</Text>
      <TextInput
        style={styles.input}
        value={direccion}
        onChangeText={setDireccion}
        placeholder="Dirección completa"
      />

      <Text style={styles.label}>Teléfono *</Text>
      <TextInput
        style={styles.input}
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
        placeholder="Número de contacto"
      />

      <Text style={styles.label}>Correo electrónico</Text>
      <TextInput
        style={styles.input}
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
        placeholder="Correo electrónico"
      />

      <TouchableOpacity style={styles.botonGuardar} onPress={guardarCambios}>
        <Text style={styles.textoBotonGuardar}>Guardar Cambios</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botonVolver} onPress={() => navigation.goBack()}>
        <Text style={styles.textoBotonVolver}>Volver</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: { flexGrow: 1, padding: 20, backgroundColor: '#fff5ee' },
  titulo: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#e85d2e', 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  label: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#333', 
    marginTop: 10, 
    marginBottom: 5 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 8, 
    padding: 12, 
    backgroundColor: '#fff' 
  },
  botonGuardar: {
    backgroundColor: '#e85d2e',
    borderRadius: 12,
    paddingVertical: 15,
    marginTop: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  textoBotonGuardar: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
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
  texto: { fontSize: 16, textAlign: 'center', marginVertical: 20 },
});
