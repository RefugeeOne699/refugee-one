import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createContext, useMemo, useState } from "react";

import database, { auth } from "@/clients/firebase";
/**
 * User field (todo)
 *
 */
const AuthContext = createContext({
  user: undefined,
  pullUser: () => {},
  signIn: () => {},
  signOut: () => {},
  signUp: () => {},
});

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState();

  const pullUser = async (authUser) => {
    if (authUser) {
      const docRef = doc(database, "Users", authUser.uid);
      const docSnap = await getDoc(docRef);
      setUser(docSnap.data());
    } else {
      setUser(undefined);
    }
  };

  const signIn = (payload) => {
    const { email, password } = payload;
    return signInWithEmailAndPassword(auth, email, password)
      .then(() => {})
      .catch((error) => {
        // todo: store error info
        throw new Error(error);
      });
  };

  const signUp = (payload) => {
    console.log(payload);
    const { email, password, name, phone } = payload;
    return createUserWithEmailAndPassword(auth, email, password)
      .then(async (credential) => {
        await setDoc(doc(database, "Users", credential.user.uid), {
          name,
          email,
          role: "Admin",
          phone,
        });
      })
      .catch((error) => {
        // todo: store error info
        throw new Error(error);
      });
  };

  const signOut = () => {
    return firebaseSignOut(auth)
      .then(() => {})
      .catch((error) => {
        throw new Error(error);
      });
  };

  const contextValue = useMemo(
    () => ({
      user,
      pullUser,
      signIn,
      signOut,
      signUp,
    }),
    [user, pullUser]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthContextProvider };
