// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlRv-CxDooFYHyOqL2r5cEgReNn3lkg7E",
  authDomain: "bioafya-34f2a.firebaseapp.com",
  projectId: "bioafya-34f2a",
  storageBucket: "bioafya-34f2a.firebasestorage.app",
  messagingSenderId: "564855606046",
  appId: "1:564855606046:web:a751283cb14f9f3ea6970f",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db, app, collection, query, where, onSnapshot };
