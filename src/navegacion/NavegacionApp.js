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

// Pantallas del admin
import AdminPantalla from '../pantallas/AdminPantallaInicio';


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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
