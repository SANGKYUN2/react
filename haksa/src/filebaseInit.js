// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4vaxJPtAJH8XrQqE260UY4Moe2W9uxgA",
  authDomain: "kosmo-7f89e.firebaseapp.com",
  databaseURL: "https://kosmo-7f89e-default-rtdb.firebaseio.com",
  projectId: "kosmo-7f89e",
  storageBucket: "kosmo-7f89e.appspot.com",
  messagingSenderId: "131800699915",
  appId: "1:131800699915:web:83b2b1b7bf0d22ed61a30e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);