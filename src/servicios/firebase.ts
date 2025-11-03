// src/servicios/firebase.ts
// Configuración automática de Firebase para React Native

import { firebase } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Verifica si Firebase está inicializado
if (!firebase.apps.length) {
  firebase.initializeApp();
  console.log('Firebase inicializado correctamente');
} else {
  console.log(' Firebase ya estaba inicializado');
}

export { firebase, auth, firestore };
