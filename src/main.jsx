import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AppRoot from "./App";
import { AuthContextProvider } from "./models/auth";
import { JobContextProvider } from "./models/job";
import AddJob from "./pages/AddJob";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminJobPostings from "./pages/AdminJobPostings";
import EmployerJobPostings from "./pages/EmployerJobPostings";
// import Demo from "./pages/Demo";
// import Detail from "./pages/Detail";
// import DrinkList from "./pages/DrinkList";
// import ErrorBoundary from "./pages/ErrorBoundary";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import UserJobPage from "./pages/UserJobPostings";
import UserSavedJobs from "./pages/UserSavedJobs";

// import Login from "./pages/Login";
// import Popular from "./pages/Popular";
// import Random from "./pages/Random";
// import Register from "./pages/Register";
// import Search from "./pages/Search";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppRoot />,
    // errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Home />, // TODO: home page
      },
      {
        path: "signUp",
        element: <SignUp />,
      },
      {
        path: "employer-jobpostings",
        element: <EmployerJobPostings />,
      },
      {
        path: "admin-jobpostings",
        element: <AdminJobPostings />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "addJob",
        element: <AddJob />, //add job listing
      },
      {
        path: "adminDash",
        element: <AdminDashboard />,
      },
      {
        path: "user-jobpostings",
        element: <UserJobPage />,
      },
      {
        path: "user-savedjobs",
        element: <UserSavedJobs />,
      },
      // {
      //   path: "login",
      //   element: <Login />,
      // },
      // {
      //   path: "register",
      //   element: <Register />,
      // },
      // {
      //   path: "profile",
      //   element: <div>Profile</div>, // TODO: note we need route guard
      // },
      // {
      //   path: "random",
      //   element: <Random />, // TODO: get a random cocktail when loading, click to get another
      // },
      // {
      //   path: "search",
      //   element: <Search />, // TODO: search results page; read query from url param; multiple filters
      // },
      // {
      //   path: "detail/:cocktailId",
      //   element: <Detail />,
      // },
      // {
      //   path: "popular",
      //   element: <Popular />,
      // },
      // {
      //   path: "my-list",
      //   element: <DrinkList />,
      // },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <JobContextProvider>
        <RouterProvider router={router} />
      </JobContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
