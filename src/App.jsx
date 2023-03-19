import "./App.css";

import { useRequest } from "ahooks";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useMemo } from "react";
import { Outlet } from "react-router-dom";

import { auth as firebaseAuth } from "@/clients/firebase";
import Navbar from "@/components/Navbar";

import { useAuth } from "./models";

export default function App() {
  const auth = useAuth();
  const { run, loading } = useRequest(async (user) => auth.pullUser(user), {
    manual: true,
  });
  useEffect(() => {
    // Global observer for firebase user
    onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        await run(user);
      } else {
        // User is signed out
        await run(undefined);
      }
    });
  }, []);
  
  /**
   * what's happening here:
   * if you access a page that requires auth information,
   * you need to let the website fetch the auth information before loading the page.
   * Otherwise, there will be an error
   */
  const main = useMemo(
    () =>
      loading ? (
        // todo: add a loading spin
        "Loading"
      ) : (
        <div className="flex flex-row gap-2">
          <div className="flex-none">
            <Navbar />
          </div>
          <div className="flex-auto flex flex-col">
            <Outlet />
          </div>
        </div>
      ),
    [loading, auth.user]
  );

  return main;
}
