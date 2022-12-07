import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AppRoot from "./App";
import Demo from "./pages/Demo";
import ErrorBoundary from "./pages/ErrorBoundary";
import Home from "./pages/Home";
import Random from "./pages/Random";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppRoot />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Home />, // TODO: home page
      },
      {
        path: "demo",
        element: <Demo />,
      },
      {
        path: "login",
        element: <div>Login</div>, // TODO
      },
      {
        path: "register",
        element: <div>Register</div>, // TODO
      },
      {
        path: "profile",
        element: <div>Profile</div>, // TODO: note we need route guard
      },
      {
        path: "random",
        element: <Random />, // TODO: get a random cocktail when loading, click to get another
      },
      {
        path: "search",
        element: <div>Search</div>, // TODO: search results page; read query from url param; multiple filters
      },
      {
        path: "detail/:cocktailId",
        element: <div>Cocktail Detail</div>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
