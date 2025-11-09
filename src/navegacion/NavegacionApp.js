import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Pantallas principales
import InicioSesionPantalla from '../pantallas/InicioSesionPantalla';
import RegistroPantalla from '../pantallas/RegistroPantalla';
import InicioPantalla from '../pantallas/InicioPantalla';

// Pantallas del Operario
import RegistroConsumoPantalla from '../pantallas/RegistroConsumoPantalla';
import InventarioPantalla from '../pantallas/InventarioPantalla';
import AlertasPantalla from '../pantallas/AlertasPantalla';

// Pantallas del Administrador
import AdminPantalla from '../pantallas/AdminPantalla';
import ReportesInsumos from '../pantallas/ReportesInsumos';
import ListaProveedores from '../pantallas/ListaProveedores';
import AprobarPedidos from '../pantallas/AprobarPedidos';
import AgregarProveedor from '../pantallas/AgregarProveedor';
import GestionProveedores from '../pantallas/GestionProveedores';
import EditarProveedor from '../pantallas/EditarProveedor';
import InventarioAdmin from '../pantallas/InventarioAdmin';

const Stack = createNativeStackNavigator();

export default function NavegacionApp() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="InicioSesion"
        screenOptions={{
          headerStyle: { backgroundColor: '#ff6b35' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        {/* Sesión y registro */}
        <Stack.Screen
          name="InicioSesion"
          component={InicioSesionPantalla}
          options={{ title: 'Iniciar Sesión' }}
        />
        <Stack.Screen
          name="Registro"
          component={RegistroPantalla}
          options={{ title: 'Registro' }}
        />

        {/* Menú principal Operario */}
        <Stack.Screen
          name="Inicio"
          component={InicioPantalla}
          options={{ title: 'Inicio Operario' }}
        />

        {/* Funciones del Operario */}
        <Stack.Screen
          name="RegistroConsumo"
          component={RegistroConsumoPantalla}
          options={{ title: 'Registrar Consumo' }}
        />
        <Stack.Screen
          name="Inventario"
          component={InventarioPantalla}
          options={{ title: 'Consultar Inventario' }}
        />
        <Stack.Screen
          name="Alertas"
          component={AlertasPantalla}
          options={{ title: 'Ver Alertas' }}
        />

        {/* Panel de administración */}
        <Stack.Screen
          name="Admin"
          component={AdminPantalla}
          options={{ title: 'Panel de Administración' }}
        />

        {/* Funcionalidades del Administrador */}
        <Stack.Screen
          name="InventarioAdmin"
          component={InventarioAdmin}
          options={{ title: 'Inventario de insumos' }}
        />
        <Stack.Screen
          name="GestionProveedores"
          component={GestionProveedores}
          options={{ title: 'Gestión Proveedores' }}
        />
        <Stack.Screen
          name="ReportesInsumos"
          component={ReportesInsumos}
          options={{ title: 'Reportes de Insumos' }}
        />
        <Stack.Screen
          name="ListaProveedores"
          component={ListaProveedores}
          options={{ title: 'Lista Proveedores' }}
        />
        <Stack.Screen
          name="AgregarProveedor"
          component={AgregarProveedor}
          options={{ title: 'Agregar Proveedor' }}
        />  
        <Stack.Screen
          name="EditarProveedor"
          component={EditarProveedor}
          options={{ title: 'Editar información de proveedor' }}
        />
        <Stack.Screen
          name="AprobarPedidos"
          component={AprobarPedidos}
          options={{ title: 'Aprobar / Rechazar Pedidos' }}
        />  
      </Stack.Navigator>
    </NavigationContainer>
  );
}
