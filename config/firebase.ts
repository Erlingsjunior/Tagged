/**
 * 🔥 Firebase Configuration
 *
 * Este arquivo contém a configuração do Firebase para o Tagged App.
 *
 * IMPORTANTE: Em produção, essas credenciais devem vir de variáveis de ambiente.
 * Para desenvolvimento, estão hardcoded aqui.
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBCyzGJg1T0nRTO4kZLafklRmemdIYYOLQ",
  authDomain: "taggedapp-12645.firebaseapp.com",
  projectId: "taggedapp-12645",
  storageBucket: "taggedapp-12645.firebasestorage.app",
  messagingSenderId: "100939753232",
  appId: "1:100939753232:android:58d104a5fb8f52ec87a795",
};

// Inicializar Firebase apenas uma vez
let app: FirebaseApp;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  console.log('🔥 Firebase inicializado com sucesso!');
} else {
  app = getApps()[0];
}

// Inicializar serviços Firebase
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);
const storage = getStorage(app);

// Log de inicialização
console.log('✅ Firebase Auth configurado');
console.log('✅ Firestore configurado');
console.log('✅ Firebase Storage configurado');

export { app, auth, db, storage };
export default app;
