import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AppRoot from "./App";
import ErrorBoundary from "./pages/ErrorBoundary";
import Home from "./pages/Home";

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
        element: <div>Random</div>, // TODO: get a random cocktail when loading, click to get another
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
