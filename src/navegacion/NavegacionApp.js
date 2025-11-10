import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// ----------------- AUTENTICACIÓN -----------------
import InicioSesionPantalla from '../pantallas/Auth/InicioSesionPantalla';
import RegistroPantalla from '../pantallas/Auth/RegistroPantalla';

// ----------------- OPERARIO -----------------
import InicioPantalla from '../pantallas/Operario/InicioPantalla';
import RegistroConsumoPantalla from '../pantallas/Operario/RegistroConsumoPantalla';
import InventarioPantalla from '../pantallas/Operario/InventarioPantalla';
import AlertasPantalla from '../pantallas/Operario/AlertasPantalla';

// ----------------- ADMINISTRADOR -----------------
import AdminPantalla from '../pantallas/Admin/AdminPantalla';
import InventarioAdmin from '../pantallas/Admin/InventarioAdmin';
import GestionProveedores from '../pantallas/Admin/GestionProveedores';
import ReportesInsumos from '../pantallas/Admin/ReportesInsumos';
import ListaProveedores from '../pantallas/Admin/ListaProveedores';
import AgregarProveedor from '../pantallas/Admin/AgregarProveedor';
import EditarProveedor from '../pantallas/Admin/EditarProveedor';
import AprobarPedidos from '../pantallas/Admin/AprobarPedidos';

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
        {/* 🔐 Autenticación */}
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

        {/* 👷‍♂️ Operario */}
        <Stack.Screen
          name="Inicio"
          component={InicioPantalla}
          options={{ title: 'Inicio Operario' }}
        />
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

        {/* 🧑‍💼 Administrador */}
        <Stack.Screen
          name="Admin"
          component={AdminPantalla}
          options={{ title: 'Panel de Administración' }}
        />
        <Stack.Screen
          name="InventarioAdmin"
          component={InventarioAdmin}
          options={{ title: 'Inventario de Insumos' }}
        />
        <Stack.Screen
          name="GestionProveedores"
          component={GestionProveedores}
          options={{ title: 'Gestión de Proveedores' }}
        />
        <Stack.Screen
          name="ReportesInsumos"
          component={ReportesInsumos}
          options={{ title: 'Reportes de Insumos' }}
        />
        <Stack.Screen
          name="ListaProveedores"
          component={ListaProveedores}
          options={{ title: 'Lista de Proveedores' }}
        />
        <Stack.Screen
          name="AgregarProveedor"
          component={AgregarProveedor}
          options={{ title: 'Agregar Proveedor' }}
        />
        <Stack.Screen
          name="EditarProveedor"
          component={EditarProveedor}
          options={{ title: 'Editar Información de Proveedor' }}
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
