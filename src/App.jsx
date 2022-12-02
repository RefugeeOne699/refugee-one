import "./App.css";

import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <div id="head">This is a header</div>
      <div id="main">
        <Outlet />
      </div>
    </>
  );
}

export default App;
