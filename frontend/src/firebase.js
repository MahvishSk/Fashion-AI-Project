import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBiLXgrGx2vCUZTkoK1yAMMox9HwyGz9Yk",
  authDomain: "style-u-a7508.firebaseapp.com",
  projectId: "style-u-a7508",
  storageBucket: "style-u-a7508.appspot.com",
  messagingSenderId: "495656925012",
  appId: "1:495656925012:web:be804c1d816c2de3f3bac1",
};

const app = initializeApp(firebaseConfig);

// ✅ Enable persistent auth (saves login across reloads)
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("Auth persistence enabled"))
  .catch((error) => console.error("Auth persistence error:", error));

export const db = getFirestore(app);
export const storage = getStorage(app);
export { app, auth };