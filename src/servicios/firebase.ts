// archivo firebase.ts 

import { FirebaseApp, initializeApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Inicializa Firebase automáticamente usando google-services.json
const app: FirebaseApp = initializeApp();

export { app, auth, firestore };
