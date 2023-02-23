import { doc, getDoc, setDoc } from "firebase/firestore";

import database from "@/clients/firebase";

class Database {
  async pullData(collection, id) {
    console.log("Pulling data");
    const docRef = doc(database, collection, id);
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data());
    return new Promise((resolve, reject) => {
      resolve(docSnap.data());
      reject("Error");
    });
  }

  async setData(collection, id, data) {
    const docRef = doc(database, collection, id);
    await setDoc(docRef, data);
  }
}

const db = new Database();

export default db;
