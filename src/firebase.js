import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD601vkTvqLef4TWOHASQA5JBl9S-ivtVk",
  authDomain: "muro-interactivo-20250275.firebaseapp.com",
  projectId: "muro-interactivo-20250275",
  storageBucket: "muro-interactivo-20250275.firebasestorage.app",
  messagingSenderId: "754039707807",
  appId: "1:754039707807:web:f9bf1dcfb477feb959eaaa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); 