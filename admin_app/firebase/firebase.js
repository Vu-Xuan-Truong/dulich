// firebase/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
const firebaseConfig = {
  apiKey: "AIzaSyCluanWJ4hOFgWJJPDCEQeZ7Ubw7-zB3pw",
  authDomain: "dulich-6592c.firebaseapp.com",
  projectId: "dulich-6592c",
  storageBucket: "dulich-6592c.appspot.com",
  messagingSenderId: "191575077165",
  appId: "1:191575077165:web:8637afc4c3f8a6318763a4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const firestore = getFirestore(app);

const storage = getStorage(app);
// Export both auth and firestore
export { auth, firestore, storage };
