import "./App.css";

import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { auth as firebaseAuth } from "@/clients/firebase";
import Navbar from "@/components/Navbar";

import { useAuth } from "./models";
import { RequireAuth } from "./models/auth";

export default function App() {
  const auth = useAuth();
  useEffect(() => {
    // Global observer for firebase user
    onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        await auth.pullUserRequest.run(user);
      } else {
        // User is signed out
        await auth.pullUserRequest.run(undefined);
      }
    });
  }, []);

  /**
   * what's happening here:
   * if you access a page that requires auth information,
   * you need to let the website fetch the auth information before loading the page.
   * Otherwise, there will be an error
   */
  return (
    <RequireAuth>
      <div className="flex md:flex-row max-md:flex-col h-full overflow-auto">
        <div className="flex-none">
          <Navbar />
        </div>

        {/* add max-h for mobile to avoid the nav-bar scrolling away problem */}
        {/* avoid using h-screen or 100vh for mobile view */}
        <div className="flex-auto flex flex-col max-md:max-h-[calc(100%_-_4em)]">
          <Outlet />
        </div>
      </div>
    </RequireAuth>
  );
}
