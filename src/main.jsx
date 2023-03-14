import "./index.css";

import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import AppRoot from "./App";
import { AdminContextProvider } from "./models/admin";
import { AuthContextProvider } from "./models/auth";
import { JobContextProvider } from "./models/job";

const AddJob = lazy(async () => import("@/pages/AddJob"));
const Admin = {
  Dashboard: lazy(async () => import("@/pages/admin/AdminDashboard")),
  PendingJobs: lazy(async () => import("@/pages/admin/AdminPendingJobs")),
};
const Employer = {
  Jobs: lazy(async () => import("@/pages/EmployerJobPostings")),
};

const SignUp = lazy(async () => import("@/pages/SignUp"));
const Home = lazy(async () => import("@/pages/Home"));
const Profile = lazy(async () => import("@/pages/Profile"));

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
        path: "employer",
        children: [
          {
            path: "jobs",
            element: <Employer.Jobs />,
          },
        ],
      },
      {
        path: "addJob",
        element: <AddJob />, //add job listing
      },
      {
        path: "profile",
        element: <Profile />,
      },
      // example: example for router and nested router
      {
        path: "admin",
        element: (
          <AdminContextProvider>
            <Outlet />
          </AdminContextProvider>
        ),
        // element: <AdminContextProvider />,
        children: [
          {
            index: true,
            element: <Admin.Dashboard />,
          },
          {
            path: "pendingJobs",
            element: <Admin.PendingJobs />,
          },
        ],
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
    <Suspense>
      <AuthContextProvider>
        <JobContextProvider>
          <RouterProvider router={router} />
        </JobContextProvider>
      </AuthContextProvider>
    </Suspense>
  </React.StrictMode>
);
