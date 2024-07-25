// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "kaydi-ecommerce.firebaseapp.com",
  projectId: "kaydi-ecommerce",
  storageBucket: "kaydi-ecommerce.appspot.com",
  messagingSenderId: "677063624329",
  appId: "1:677063624329:web:2a9b256a9aa301f7d46858",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
