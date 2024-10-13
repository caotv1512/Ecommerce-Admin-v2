// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyATTLxovOx8na1ShXTgeOmCacMJUf44wxA",
  authDomain: "web-ban-tranh-caotv.firebaseapp.com",
  projectId: "web-ban-tranh-caotv",
  storageBucket: "web-ban-tranh-caotv.appspot.com",
  messagingSenderId: "660306205029",
  appId: "1:660306205029:web:bd7212caf219b60a0de98c",
  measurementId: "G-KWE7Y6SDDC"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Lấy đối tượng Storage
const storage = getStorage(app);

export { storage };