import "./App.css";

// import { onAuthStateChanged } from "firebase/auth";
// import { useEffect } from "react";
import { Outlet } from "react-router-dom";

// import { auth } from "@/clients/firebase";

function App() {
  // useEffect(() => {
  //   // Global observer for firebase user
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       // User is signed in, see docs for a list of available properties
  //       // https://firebase.google.com/docs/reference/js/firebase.User
  //       store.dispatch(
  //         setUser({
  //           uid: user.uid,
  //           email: user.email,
  //           // More to add here
  //         })
  //       );
  //       store.dispatch(initUserData());
  //     } else {
  //       // User is signed out
  //       store.dispatch(setUser(null));
  //     }
  //   });
  // }, []);

  return (
    <>
      {/* <div className="flex-none">
        <Navbar userData={model.userData} signOut={() => store.dispatch(logoutUser())} />
      </div> */}
      <div className="flex-auto flex flex-col">
        <Outlet />
      </div>
    </>
  );
}

export default App;
