import "./App.css";

import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { auth } from "@/clients/firebase";
import { useModel } from "@/hooks";
import store from "@/store";
import { initUserData, logoutUser, setUser } from "@/store/userData";

import Navbar from "./components/Navbar";

// Global observer for firebase user
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    store.dispatch(
      setUser({
        uid: user.uid,
        email: user.email,
        // More to add here
      })
    );
    store.dispatch(initUserData());
  } else {
    // User is signed out
    store.dispatch(setUser(null));
  }
});

function App() {
  const model = useModel();

  return (
    <>
      <div className="flex-none">
        <Navbar userData={model.userData} signOut={() => store.dispatch(logoutUser())} />
      </div>
      <div className="flex-auto flex flex-col">
        <Outlet />
      </div>
    </>
  );
}

export default App;
