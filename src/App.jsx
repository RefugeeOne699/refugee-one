import "./App.css";

import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { auth as firebaseAuth } from "@/clients/firebase";
import Navbar from "@/components/Navbar";

import { useAuth } from "./models";

export default function App() {
  const auth = useAuth();
  useEffect(() => {
    // Global observer for firebase user
    onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        await auth.pullUser(user);
      } else {
        // User is signed out
        await auth.pullUser(undefined);
      }
    });
  }, []);

  return (
    <div className="flex flex-row gap-2">
      <>
        <Navbar />
      </>
      <div className="flex-auto flex flex-col m-3">
        <Outlet />
      </div>
    </div>
  );
}
