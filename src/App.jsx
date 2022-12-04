import "./App.css";

import { Outlet } from "react-router-dom";

import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <div className="flex-none">
        <Navbar />
      </div>
      <div className="flex-auto flex flex-col">
        <Outlet />
      </div>
    </>
  );
}

export default App;
