

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  FlatList,
  Modal,
} from 'react-native';
import { firestore } from '../../servicios/firebase';

export default function AgregarPedidos() {

  
  const [proveedorId, setProveedorId] = useState('');
  const [proveedorNombre, setProveedorNombre] = useState('');
  const [listaProveedores, setListaProveedores] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [insumo, setInsumo] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [unidad, setUnidad] = useState('');
  const [listaInsumos, setListaInsumos] = useState([]);


  const [historial, setHistorial] = useState([]);


  useEffect(() => {
    const cargarProveedores = async () => {
      try {
        const snap = await firestore().collection('proveedores').get();

        const lista = snap.docs.map(doc => {
          const datos = doc.data();
          return {
            id: doc.id,
            nombre: datos.nombre || 'Sin nombre',
          };
        });

        setListaProveedores(lista);
      } catch (error) {
        console.error('Error al cargar proveedores:', error);
        Alert.alert('Error', 'No se pudieron cargar los proveedores.');
      }
    };

    cargarProveedores();
  }, []);

  const agregarInsumo = () => {
    if (!insumo || !cantidad) {
      Alert.alert('Campos incompletos', 'Debes ingresar el nombre y la cantidad del insumo.');
      return;
    }

    const nuevoInsumo = {
      idInsumo: firestore().collection('inventario').doc().id,
      nombre: insumo,
      stock: parseInt(cantidad),
      unidad: unidad || 'unidad',
    };

    setListaInsumos(prev => [...prev, nuevoInsumo]);

 
    setInsumo('');
    setCantidad('');
    setUnidad('');
  };


  const registrarPedido = async () => {
    if (!proveedorId || listaInsumos.length === 0) {
      Alert.alert('Error', 'Debes seleccionar un proveedor y agregar al menos un insumo.');
      return;
    }

    try {

      const totalPedido = listaInsumos.reduce((acc, item) => acc + (item.stock || 0), 0);

 
      await firestore().collection('pedidos').add({
        idProveedor: proveedorId,
        estado: 'aprobado',
        fechaPedido: new Date().toLocaleString(),
        total: totalPedido,
        Insumos: listaInsumos,
      });

      for (const item of listaInsumos) {
        const querySnap = await firestore()
          .collection('inventario')
          .where('nombre', '==', item.nombre)
          .get();

        if (!querySnap.empty) {
          const docExistente = querySnap.docs[0];
          const datos = docExistente.data();
          const nuevoStock = (datos.stock || 0) + parseInt(item.stock);
          await firestore().collection('inventario').doc(docExistente.id).update({
            stock: nuevoStock,
          });
        } else {
          await firestore().collection('inventario').add({
            nombre: item.nombre,
            stock: parseInt(item.stock),
            unidad: item.unidad || 'unidad',
          });
        }
      }


      const nuevoPedido = {
        id: Date.now().toString(),
        proveedorNombre,
        total: totalPedido,
        fecha: new Date().toLocaleDateString(),
      };
      setHistorial(prev => [...prev, nuevoPedido]);

      Alert.alert('Éxito', 'Pedido registrado correctamente.');
      setProveedorId('');
      setProveedorNombre('');
      setListaInsumos([]);
    } catch (error) {
      console.error('Error al registrar pedido:', error);
      Alert.alert('Error', 'Ocurrió un problema al registrar el pedido.');
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Agregar Pedido</Text>


      <Text style={styles.label}>Proveedor *</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={{ color: proveedorNombre ? '#000' : '#999' }}>
          {proveedorNombre || 'Selecciona un proveedor'}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>Seleccionar proveedor</Text>

            <FlatList
              data={listaProveedores}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setProveedorId(item.id);
                    setProveedorNombre(item.nombre);   
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItemTexto}>{item.nombre}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.modalCerrar}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCerrarTexto}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      <Text style={styles.subtitulo}>Insumos del pedido</Text>

      <Text style={styles.label}>Nombre del insumo *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Detergente"
        value={insumo}
        onChangeText={setInsumo}
      />

      <Text style={styles.label}>Cantidad *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: 10"
        keyboardType="numeric"
        value={cantidad}
        onChangeText={setCantidad}
      />

      <Text style={styles.label}>Unidad</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: L, kg, unidades"
        value={unidad}
        onChangeText={setUnidad}
      />

      <TouchableOpacity style={styles.botonSecundario} onPress={agregarInsumo}>
        <Text style={styles.textoBoton}>+ Agregar Insumo</Text>
      </TouchableOpacity>

      {listaInsumos.length > 0 && (
        <View style={styles.listaInsumos}>
          {listaInsumos.map((item, i) => (
            <Text key={i} style={styles.insumoTexto}>
              • {item.nombre} — {item.stock} {item.unidad}
            </Text>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.boton} onPress={registrarPedido}>
        <Text style={styles.textoBoton}>Guardar Pedido</Text>
      </TouchableOpacity>


      <Text style={styles.subtitulo}>Pedidos agregados esta sesión</Text>

      {historial.length === 0 ? (
        <Text style={styles.noHistorial}>No hay pedidos registrados aún.</Text>
      ) : (
        <FlatList
          data={historial}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.historialItem}>
              <Text style={styles.historialTexto}>
                {item.fecha} - {item.proveedorNombre} (Total unidades: {item.total})
              </Text>
            </View>
          )}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff5ee', flexGrow: 1 },
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
  botonSecundario: {
    backgroundColor: '#ffa76a',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBoton: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  listaInsumos: {
    backgroundColor: '#ffebd6',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  insumoTexto: { fontSize: 15, color: '#333' },
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e85d2e',
    marginTop: 15,
    marginBottom: 10,
  },
  noHistorial: { fontSize: 16, color: '#333', fontStyle: 'italic' },
  historialItem: {
    backgroundColor: '#ffebd6',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  historialTexto: { fontSize: 15, color: '#333' },

  // ----- MODAL -----
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#e85d2e',
  },
  modalItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItemTexto: {
    fontSize: 16,
    color: '#333',
  },
  modalCerrar: {
    marginTop: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalCerrarTexto: {
    fontSize: 16,
    color: '#e85d2e',
    fontWeight: 'bold',
  },
});
