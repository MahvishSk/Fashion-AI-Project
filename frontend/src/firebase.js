// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCw_Ov3H0HkgWo5ZsGYHpgxVxbMLfQ-LU8",
  authDomain: "fashion-ai-project-b9c86.firebaseapp.com",
  projectId: "fashion-ai-project-b9c86",
  storageBucket: "fashion-ai-project-b9c86.appspot.com",
  messagingSenderId: "371004564448",
  appId: "1:371004564448:web:c61868ea41c353dddd0185",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔥 EXPORT THESE (THIS WAS MISSING)
export const auth = getAuth(app);
export const db = getFirestore(app);
