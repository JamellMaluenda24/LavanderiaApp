import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import RNPrint from 'react-native-print';
import { firestore } from '../../servicios/firebase';

export default function ReportesInsumos({ navigation }) {
  const [generando, setGenerando] = useState(false);
  const [tipoReporte, setTipoReporte] = useState(null);

  const obtenerDatosInsumos = async () => {
    try {
      const snap = await firestore().collection('inventario').get();

      const datos = snap.docs.map(doc => {
        const d = doc.data();

        const stock = Number(d.stock ?? 0);
        const stockMinimo = Number(d.minimo ?? 5); 

        return {
          id: doc.id,
          nombre: d.nombre || 'Sin nombre',
          cantidad: stock,
          unidad: d.unidad || 'unid.',
          stockMinimo,
        };
      });

      return datos;
    } catch (error) {
      console.error('Error al obtener insumos para reporte:', error);
      Alert.alert('Error', 'No se pudieron obtener los insumos desde la base de datos.');
      return [];
    }
  };

  const generarHTMLReporte = (datos, tipo, fechaInicio, fechaFin) => {
    const fecha = new Date().toLocaleDateString('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const hora = new Date().toLocaleTimeString('es-CL');
    const periodo = tipo === 'semanal' ? 'Semanal' : 'Mensual';

    const totalInsumos = datos.length;


    const insumosConBajoStock = datos.filter(i => i.cantidad <= i.stockMinimo).length;

    const filasTabla = datos.map((item) => {
      const alertaStock = item.cantidad <= item.stockMinimo; 
      const colorFila = alertaStock ? '#fff3cd' : 'transparent';
      const textoEstado = alertaStock
        ? '<span style="color: #dc3545; font-weight: bold;"> Bajo Stock</span>'
        : '<span style="color: #28a745;"> Normal</span>';

      return `
        <tr style="background-color: ${colorFila};">
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.nombre}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">
            <strong>${item.cantidad}</strong> ${item.unidad}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">
            ${item.stockMinimo} ${item.unidad}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">
            ${textoEstado}
          </td>
        </tr>
      `;
    }).join('');


    const alertasStock = datos
      .filter(i => i.cantidad <= i.stockMinimo) 
      .map(item => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">⚠️ ${item.nombre}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center; color: #dc3545;">
            <strong>${item.cantidad}</strong> ${item.unidad}
          </td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">
            ${item.stockMinimo} ${item.unidad}
          </td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">
            Reabastecer ${Math.max(item.stockMinimo - item.cantidad, 0)} ${item.unidad}
          </td>
        </tr>
      `).join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 30px;
              color: #333;
            }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 4px solid #e85d2e; padding-bottom: 20px; }
            .logo { font-size: 36px; color: #e85d2e; font-weight: bold; }
            .titulo { font-size: 26px; margin: 15px 0; font-weight: bold; }

            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th { background: #e85d2e; color: white; padding: 14px; text-align: left; }
            td { padding: 10px; border-bottom: 1px solid #ddd; }
            tr:nth-child(even) { background-color: #f9f9f9; }

            .alerta-box { background-color: #fff3cd; padding: 20px; border-radius: 5px; margin-top: 25px; }

            .footer { margin-top: 40px; text-align: center; color: #999; font-size: 12px; padding-top: 20px; border-top: 1px solid #eee; }
          </style>
        </head>

        <body>
          <div class="header">
            <div class="logo">LAVANDERÍA DEL COBRE</div>
            <div class="titulo">Reporte ${periodo} de Insumos</div>
          </div>

          <p><strong>Fecha:</strong> ${fecha}</p>
          <p><strong>Hora:</strong> ${hora}</p>
          <p><strong>Total de insumos:</strong> ${totalInsumos}</p>

          ${insumosConBajoStock > 0 ? `
            <div class="alerta-box">
              <h3>⚠️ Alertas de Stock Bajo (${insumosConBajoStock})</h3>
              <table>
                <thead>
                  <tr>
                    <th>Insumo</th>
                    <th style="text-align:center;">Stock</th>
                    <th style="text-align:center;">Mínimo</th>
                    <th style="text-align:center;">Acción</th>
                  </tr>
                </thead>
                <tbody>${alertasStock}</tbody>
              </table>
            </div>
          ` : ''}

          <h3 style="margin-top:30px;">Inventario de Insumos</h3>
          <table>
            <thead>
              <tr>
                <th>Insumo</th>
                <th style="text-align:center;">Stock Actual</th>
                <th style="text-align:center;">Stock Mínimo</th>
                <th style="text-align:center;">Estado</th>
              </tr>
            </thead>
            <tbody>${filasTabla}</tbody>
          </table>

          <div class="footer">
            LAVANDERÍA DEL COBRE – Sistema de Gestión de Insumos
          </div>
        </body>
      </html>
    `;
  };

  const generarReportePrint = async (tipo) => {
    try {
      setGenerando(true);
      setTipoReporte(tipo);

      const fechaFin = new Date();
      const fechaInicio = new Date();
      if (tipo === 'semanal') fechaInicio.setDate(fechaInicio.getDate() - 7);
      else fechaInicio.setMonth(fechaInicio.getMonth() - 1);

      const datos = await obtenerDatosInsumos();
      const htmlContent = generarHTMLReporte(
        datos,
        tipo,
        fechaInicio.toLocaleDateString('es-CL'),
        fechaFin.toLocaleDateString('es-CL')
      );

      await RNPrint.print({ html: htmlContent });

      setGenerando(false);
    } catch (error) {
      setGenerando(false);
      console.error(error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Reportes de Insumos</Text>
        <Text style={styles.subtitulo}>Genera e imprime reportes PDF</Text>
      </View>

      {generando ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e85d2e" />
          <Text style={styles.loadingText}>Generando reporte {tipoReporte}...</Text>
        </View>
      ) : (
        <View style={styles.botonesContainer}>
          <TouchableOpacity
            style={[styles.boton, styles.botonSemanal]}
            onPress={() => generarReportePrint('semanal')}
          >
            <Text style={styles.textoBoton}>Reporte Semanal</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.boton, styles.botonMensual]}
            onPress={() => generarReportePrint('mensual')}
          >
            <Text style={styles.textoBoton}>Reporte Mensual</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botonVolver}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.textoBotonVolver}>← Volver</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff5ee' },
  contentContainer: { padding: 20 },
  header: { alignItems: 'center', marginTop: 20, marginBottom: 30 },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#e85d2e', marginBottom: 10 },
  subtitulo: { color: '#666', textAlign: 'center', fontSize: 15 },
  botonesContainer: { marginVertical: 20 },
  boton: {
    paddingVertical: 18,
    borderRadius: 12,
    marginVertical: 10,
    alignItems: 'center',
  },
  botonSemanal: { backgroundColor: '#e85d2e' },
  botonMensual: { backgroundColor: '#ffb84d' },
  botonVolver: {
    backgroundColor: '#6c757d',
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  textoBoton: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  textoBotonVolver: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  loadingContainer: { alignItems: 'center', padding: 40 },
  loadingText: { marginTop: 15, color: '#e85d2e', fontSize: 16, fontWeight: 'bold' },
});