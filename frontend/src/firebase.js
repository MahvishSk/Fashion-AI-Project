import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBiLXgrGx2vCUZTkoK1yAMMox9HwyGz9Yk",
  authDomain: "style-u-a7508.firebaseapp.com",
  projectId: "style-u-a7508",
  storageBucket: "style-u-a7508.appspot.com",
  messagingSenderId: "495656925012",
  appId: "1:495656925012:web:be804c1d816c2de3f3bac1",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
