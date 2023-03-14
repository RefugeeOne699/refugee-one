import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createContext, useMemo, useState } from "react";

import database, { auth } from "@/clients/firebase";

/**
 * User interface
 * @param {DocumentReference} company - reference to a company doc
 * @param {string} email - user's email
 * @param {string} name - user's name
 * @param {number} phone - user's phone
 * @param {string} role - user's role
 * @param {string} uid - user's uid
 */

const AuthContext = createContext({
  user: undefined,
  userRef: undefined,
  pullUser: () => {},
  signIn: () => {},
  signOut: () => {},
  signUp: () => {},
});

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [userRef, setUserRef] = useState();

  const pullUser = async (authUser) => {
    if (authUser) {
      const docRef = doc(database, "Users", authUser.uid);
      const docSnap = await getDoc(docRef);
      setUserRef(docRef);
      setUser({
        ...docSnap.data(),
        uid: authUser.uid,
      });
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
    const { email, password, name, phone, role } = payload;
    const jobs = []
    return createUserWithEmailAndPassword(auth, email, password)
      .then(async (credential) => {
        await setDoc(doc(database, "Users", credential.user.uid), {
          name,
          email,
          role,
          phone,
          jobs
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
      userRef,
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
