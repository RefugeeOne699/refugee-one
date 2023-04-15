import { useRequest } from "ahooks";
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updatePassword as firebaseUpdatePassword,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { Navigate, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import database, { auth, subAuth, subDatabase } from "@/clients/firebase";
import Center from "@/components/Center";
import Spin from "@/components/Spin";
import { AUTH_INITIAL_STATE, ROLES, USER_STATUS } from "@/constants";

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
  pullUserRequest: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  signUp: async () => {},
  updatePassword: async () => {},
  updateProfile: async () => {},
  isSignedIn: () => Boolean,
  /**
   *
   * @param {string} _email
   */
  resetPassWordByEmail: async (_email) => {},
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

  // Sign Up
  const signUp = async (payload) => {
    const { email, password, name, phone, role, company } = payload;
    // if we are creating a refugee account, the payload may not have a password.
    // so we generate a uuid() as default value, mark the account as INITIAL
    let credential = await createUserWithEmailAndPassword(
      subAuth,
      email,
      password || uuidv4()
    );
    const userDoc = {
      name,
      email,
      role,
      phone,
      company,
      status: role === ROLES.EMPLOYER ? USER_STATUS.PENDING : USER_STATUS.APPROVED,
    };
    await setDoc(doc(subDatabase, "Users", credential.user.uid), userDoc);
    await subAuth.signOut();
  };

  const resetPassWordByEmail = async (email) => {
    await sendPasswordResetEmail(subAuth, email);
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
      resetPassWordByEmail,
    }),
    [user]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

/**
 * if strict, only approved signed-in users are allowed to acess. Pending users will have no access to the content.
 */
function RequireAuth({ children, strict }) {
  let auth = useContext(AuthContext);
  let location = useLocation();

  const spinning = (
    <Center className="w-screen h-screen">
      <Spin className="h-10 w-10" />
    </Center>
  );

  /**
   * true if user is signed in but not allowed to access
   */
  const accessDenied = auth.user && strict && auth.user.status === USER_STATUS.PENDING;

  const { run, loading } = useRequest(
    async () => {
      toast.error("Access denied. Your account is not approved yet.");
      return auth.signOut();
    },
    {
      manual: true,
    }
  );

  const accessDeniedTransition = useMemo(() => {
    if (loading) {
      return spinning;
    }
    return <Navigate to="/signIn" replace />;
  }, [loading]);

  useEffect(() => {
    if (accessDenied) {
      (async () => run())();
    }
  }, [auth.user]);

  // https://github.com/remix-run/react-router/blob/6f17a3089a946cb063208877fbf25d6645852bea/examples/auth/src/App.tsx#L130
  if (auth.user === undefined) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/signIn" state={{ from: location }} replace />;
  }

  if (auth.user === AUTH_INITIAL_STATE || auth.pullUserRequest.loading) {
    return spinning;
  }

  // a pending employer account trying to sign in
  if (accessDenied) {
    return accessDeniedTransition;
  }

  return children;
}

export { AuthContext, AuthContextProvider, RequireAuth };
