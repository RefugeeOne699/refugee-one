// import { doc, getDoc, setDoc } from "firebase/firestore";

// import database from "@/clients/firebase";

// class Database {
//   async pullData(collection, id) {
//     console.log("Pulling data");
//     const docRef = doc(database, collection, id);
//     const docSnap = await getDoc(docRef);
//     console.log(docSnap.data());
//     return new Promise((resolve, reject) => {
//       resolve(docSnap.data());
//       reject("Error");
//     });
//   }

//   async setData(collection, id, data) {
//     const docRef = doc(database, collection, id);
//     await setDoc(docRef, data);
//   }
// }

// const db = new Database();

// export default db;

import { doc, getDoc, setDoc } from "firebase/firestore";
import { createContext, useMemo, useState } from "react";

import database from "@/clients/firebase";

const ProfileContext = createContext({
  fetchedData: undefined,
  pullUser: () => {},
  setUser: () => {},
});

const ProfileContextProvider = ({ children }) => {
  const [fetchedData, setFetchedData] = useState();

  const pullUser = async (collection, id) => {
    const docRef = doc(database, collection, id);
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data());
    if (docSnap.exists()) {
      setFetchedData(docSnap.data());
    } else {
      setFetchedData(undefined);
    }
  };

  const setUser = async (collection, id, data) => {
    const docRef = doc(database, collection, id);
    await setDoc(docRef, data);
  };

  const contextValue = useMemo(
    () => ({
      fetchedData,
      pullUser,
      setUser,
    }),
    [fetchedData, setFetchedData]
  );

  return (
    <ProfileContext.Provider value={contextValue}>{children}</ProfileContext.Provider>
  );
};

export { ProfileContext, ProfileContextProvider };
