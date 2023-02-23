import { doc, getDoc, setDoc } from "firebase/firestore";

import database from "@/clients/firebase";
/**
 * User field (todo)
 *
 */
// const DBContext = createContext({
//   fetchedData: undefined,
//   pullData: () => {},
//   setData: () => {},
// });

// const DBContextProvider = ({ children }) => {
//   const [fetchedData, setFetchedData] = useState();

//   const pullData = async (collection, id) => {
//     console.log("Pulling data");
//     const docRef = doc(database, collection, id);
//     const docSnap = await getDoc(docRef);
//     console.log(docSnap.data());
//     setFetchedData(docSnap.data());
//     return docSnap.data();
//   };

//   const setData = async (collection, id, data) => {
//     const docRef = doc(database, collection, id);
//     await setDoc(docRef, data);
//   };

//   const contextValue = useMemo(
//     () => ({
//       fetchedData,
//       pullData,
//       setData,
//     }),
//     [fetchedData, pullData]
//   );

//   return <DBContext.Provider value={contextValue}>{children}</DBContext.Provider>;
// };

class Database {
  async pullData(collection, id) {
    console.log("Pulling data");
    const docRef = doc(database, collection, id);
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data());
    return new Promise((resolve, reject) => {
      resolve(docSnap.data());
    });
  }

  async setData(collection, id, data) {
    const docRef = doc(database, collection, id);
    await setDoc(docRef, data);
  }
}

const db = new Database();

export default db;
