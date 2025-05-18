// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/forestore";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdhtudVUmixfYlZa3iCi6chSrJiCvYkNk",
  authDomain: "anicodes-2c255.firebaseapp.com",
  projectId: "anicodes-2c255",
  storageBucket: "anicodes-2c255.firebasestorage.app",
  messagingSenderId: "830804974169",
  appId: "1:830804974169:web:252363cce7e7f48b1d6f48",
  measurementId: "G-R266QW9LST",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
