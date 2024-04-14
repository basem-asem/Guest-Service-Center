import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCE3SMHNFkM5zPWLgF1rmBwbw7UJLYQmv4",
  authDomain: "guest-service-center.firebaseapp.com",
  projectId: "guest-service-center",
  storageBucket: "guest-service-center.appspot.com",
  messagingSenderId: "334335178460",
  appId: "1:334335178460:web:98e5d5a6dc8da44355e619",
  measurementId: "G-3KP2EX8751"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth();

export { app, db, auth, storage };
