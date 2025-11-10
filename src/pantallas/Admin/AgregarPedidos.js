
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


export default function AgregarPedidos() {

  const [proveedor, setProveedor] = useState('');
  const [insumo, setInsumo] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [unidad, setUnidad] = useState('');
  const [precio, setPrecio] = useState('');
  const [listaInsumos, setListaInsumos] = useState([]);
  const [historial, setHistorial] = useState([]);


  const agregarInsumo = () => {
    if (!insumo || !cantidad || !precio) {
      Alert.alert('Campos incompletos', 'Agrega nombre, cantidad y precio del insumo.');
      return;
    }

    const nuevoInsumo = {
      idInsumo: firestore().collection('inventario').doc().id, // ID único
      nombre: insumo,
      stock: parseInt(cantidad),
      unidad: unidad || 'unidad',
      subtotal: parseInt(precio) * parseInt(cantidad),
    };

    setListaInsumos(prev => [...prev, nuevoInsumo]);
    setInsumo('');
    setCantidad('');
    setUnidad('');
    setPrecio('');
  };


  const registrarPedido = async () => {
    if (!proveedor || listaInsumos.length === 0) {
      Alert.alert('Error', 'Debes ingresar el proveedor y al menos un insumo.');
      return;
    }

    try {

      const provSnap = await firestore()
        .collection('proveedores')
        .where('nombre', '==', proveedor)
        .get();

      if (provSnap.empty) {
        Alert.alert('Proveedor no encontrado', 'No existe un proveedor con ese nombre.');
        return;
      }

      const proveedorDoc = provSnap.docs[0];
      const proveedorId = proveedorDoc.id;

      const totalPedido = listaInsumos.reduce((acc, item) => acc + item.subtotal, 0);


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
        proveedor,
        insumos: listaInsumos,
        total: totalPedido,
        fecha: new Date().toLocaleDateString(),
      };
      setHistorial(prev => [...prev, nuevoPedido]);

      Alert.alert('✅ Éxito', 'Pedido registrado correctamente.');
      setProveedor('');
      setListaInsumos([]);
    } catch (error) {
      console.error('Error al registrar pedido:', error);
      Alert.alert('Error', 'Ocurrió un problema al registrar el pedido.');
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Agregar Pedido</Text>

      <Text style={styles.label}>Nombre del proveedor *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Limpieza Total"
        value={proveedor}
        onChangeText={setProveedor}
      />

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

      <Text style={styles.label}>Unidad *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: L, kg, unidades"
        value={unidad}
        onChangeText={setUnidad}
      />

      <Text style={styles.label}>Precio por unidad *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: 500"
        keyboardType="numeric"
        value={precio}
        onChangeText={setPrecio}
      />

      <TouchableOpacity style={styles.botonSecundario} onPress={agregarInsumo}>
        <Text style={styles.textoBoton}>+ Agregar Insumo</Text>
      </TouchableOpacity>

      {listaInsumos.length > 0 && (
        <View style={styles.listaInsumos}>
          {listaInsumos.map((item, i) => (
            <Text key={i} style={styles.insumoTexto}>
              • {item.nombre} — {item.stock} {item.unidad} — ${item.subtotal}
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
                {item.fecha} - {item.proveedor} (${item.total})
              </Text>
            </View>
          )}
        />
      )}
    </ScrollView>
  );
}

// ESTILOS
const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff5ee', flexGrow: 1 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#e85d2e', textAlign: 'center', marginBottom: 30 },
  label: { fontSize: 15, fontWeight: 'bold', color: '#e85d2e', marginBottom: 5, marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 12, backgroundColor: '#fff' },
  boton: { backgroundColor: '#e85d2e', borderRadius: 12, paddingVertical: 15, marginVertical: 20, alignItems: 'center' },
  botonSecundario: { backgroundColor: '#ffa76a', borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 10 },
  textoBoton: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  listaInsumos: { backgroundColor: '#ffebd6', padding: 12, borderRadius: 10, marginTop: 10 },
  insumoTexto: { fontSize: 15, color: '#333' },
  subtitulo: { fontSize: 18, fontWeight: 'bold', color: '#e85d2e', marginTop: 15, marginBottom: 10 },
  noHistorial: { fontSize: 16, color: '#333', fontStyle: 'italic' },
  historialItem: { backgroundColor: '#ffebd6', padding: 12, borderRadius: 10, marginBottom: 8 },
  historialTexto: { fontSize: 15, color: '#333' },
});
