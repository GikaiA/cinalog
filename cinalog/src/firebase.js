// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKgfxv4b3IhyeQTqMMq-O4mWSBR0psaHc",
  authDomain: "cinalog-f0f6a.firebaseapp.com",
  databaseURL: "https://cinalog-f0f6a-default-rtdb.firebaseio.com",
  projectId: "cinalog-f0f6a",
  storageBucket: "cinalog-f0f6a.firebasestorage.app",
  messagingSenderId: "11206906129",
  appId: "1:11206906129:web:cb49ecadbe554df5307cb0",
  measurementId: "G-JTVLDYGN8J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };