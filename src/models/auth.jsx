import { useRequest } from "ahooks";
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updatePassword as firebaseUpdatePassword,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { createContext, useContext, useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

import database, { auth } from "@/clients/firebase";
import Center from "@/components/Center";
import Spin from "@/components/Spin";
import { AUTH_INITIAL_STATE, USER_STATUS } from "@/constants";

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
  user: AUTH_INITIAL_STATE,
  userRef: undefined,
  pullUserRequest: () => {},
  signIn: () => {},
  signOut: () => {},
  signUp: () => {},
  updatePassword: () => {},
  updateProfile: () => {},
  isSignedIn: () => Boolean,
});

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(AUTH_INITIAL_STATE);
  const [userRef, setUserRef] = useState();

  const pullUserRequest = useRequest(
    async (authUser) => {
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
    },
    {
      manual: true,
    }
  );

  const signIn = (payload) => {
    setUser(AUTH_INITIAL_STATE);
    const { email, password } = payload;
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = (payload) => {
    setUser(AUTH_INITIAL_STATE);
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

  const isSignedIn = () => {
    return auth.user && auth.user !== AUTH_INITIAL_STATE;
  };

  const contextValue = useMemo(
    () => ({
      user,
      userRef,
      pullUserRequest,
      signIn,
      signOut,
      signUp,
      updatePassword,
      updateProfile,
      isSignedIn,
    }),
    [user]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

function RequireAuth({ children }) {
  let auth = useContext(AuthContext);
  let location = useLocation();
  if (auth.user === AUTH_INITIAL_STATE || auth.pullUserRequest.loading) {
    return (
      <Center className="w-screen h-screen">
        <Spin className="h-10 w-10" />
      </Center>
    );
  }
  // https://github.com/remix-run/react-router/blob/6f17a3089a946cb063208877fbf25d6645852bea/examples/auth/src/App.tsx#L130
  if (auth.user === undefined) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/signIn" state={{ from: location }} replace />;
  }
  return children;
}

export { AuthContext, AuthContextProvider, RequireAuth };
