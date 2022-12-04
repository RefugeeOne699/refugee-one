import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

import firebaseConfig from "@/firebaseConfig";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

export default database;
