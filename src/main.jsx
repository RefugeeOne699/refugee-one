import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AppRoot from "./App";
import Demo from "./pages/Demo";
import Detail from "./pages/Detail";
import DrinkList from "./pages/DrinkList";
import ErrorBoundary from "./pages/ErrorBoundary";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Popular from "./pages/Popular";
import Random from "./pages/Random";
import Register from "./pages/Register";
import Search from "./pages/Search";

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
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
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
        element: <Search />, // TODO: search results page; read query from url param; multiple filters
      },
      {
        path: "detail/:cocktailId",
        element: <Detail />,
      },
      {
        path: "popular",
        element: <Popular />,
      },
      {
        path: "my-list",
        element: <DrinkList />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
