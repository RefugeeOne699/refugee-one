import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import firebaseConfig from "@/firebaseConfig";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const subApp = initializeApp(firebaseConfig, "secondary");

// Initialize Realtime Database and get a reference to the service
const database = getFirestore(app);
const subDatabase = getFirestore(subApp);
const auth = getAuth(app);
const subAuth = getAuth(subApp);

export default database;

export { auth, subAuth, subDatabase };
