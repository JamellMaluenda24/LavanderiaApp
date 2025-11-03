/**
 * Archivo principal de la aplicación (App.jsx)
 * 
 * Este archivo actúa como punto de inicio de toda la app de React Native.
 * Aquí se carga el componente principal de navegación (NavegacionApp),
 * el cual gestiona todas las pantallas del proyecto (login, registro, inicio, etc.).
 */

import React from 'react'; 
// Importamos React, necesario para definir componentes en JSX.

import NavegacionApp from './src/navegacion/NavegacionApp'; 
// Importamos el componente de navegación que contiene la estructura
// y las rutas entre las diferentes pantallas de la aplicación.

/**
 * Componente principal de la aplicación.
 * 
 * - Es el primer componente que se ejecuta al iniciar la app.
 * - Devuelve el componente de navegación, que a su vez contiene
 *   todo el flujo de pantallas (Inicio de sesión, Registro, etc.).
 */
export default function App() {
  return <NavegacionApp />; 
  // Renderiza la navegación de la app dentro de la raíz de React Native.
}
