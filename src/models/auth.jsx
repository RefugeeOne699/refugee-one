import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updatePassword as firebaseUpdatePassword,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { createContext, useMemo, useState } from "react";

import database, { auth } from "@/clients/firebase";
import { USER_STATUS } from "@/constants";

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
  updatePassword: () => {},
  updateProfile: () => {},
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
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = (payload) => {
    console.log(payload);
    const { email, password, name, phone, role, company } = payload;
    return createUserWithEmailAndPassword(auth, email, password)
      .then(async (credential) => {
        await setDoc(doc(database, "Users", credential.user.uid), {
          name,
          email,
          role,
          phone,
          company,
          status: USER_STATUS.PENDING,
        });
      })
      .catch((error) => {
        // todo: store error info
        throw new Error(error);
      });
  };

  const signOut = () => {
    return firebaseSignOut(auth);
  };

  const updatePassword = async (payload) => {
    const { oldPassword, newPassword } = payload;
    const credential = EmailAuthProvider.credential(user.email, oldPassword);
    return reauthenticateWithCredential(auth.currentUser, credential).then(() => {
      return firebaseUpdatePassword(auth.currentUser, newPassword).then(() => {});
    });
  };

  const updateProfile = (newProfile) => {
    const docRef = doc(database, "Users", auth.currentUser.uid);
    return updateDoc(docRef, {
      name: newProfile.name,
      phone: newProfile.phone,
      address: newProfile.address,
      coordinate: newProfile.coordinate,
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
      updatePassword,
      updateProfile,
    }),
    [user, pullUser]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthContextProvider };
