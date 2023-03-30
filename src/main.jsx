import "./index.css";

import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import JobRoot from "@/pages/Job";

import AppRoot from "./App";
import TailWindToaster from "./components/TailwindToaster";
import { AdminContextProvider } from "./models/admin";
import { AuthContextProvider } from "./models/auth";
import { JobContextProvider } from "./models/job";
import { JobSaveContextProvider } from "./models/jobSave";

const AddJob = lazy(async () => import("@/pages/AddJob"));
const Admin = {
  Dashboard: lazy(async () => import("@/pages/admin/AdminDashboard")),
};

const SignUp = lazy(async () => import("@/pages/SignUp"));
const Home = lazy(async () => import("@/pages/Home"));
const Profile = lazy(async () => import("@/pages/Profile"));
const Blank = lazy(async () => import("@/components/Blank"));
const Job = {
  View: lazy(async () => import("@/components/job/JobView")),
};

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
        ],
      },
      {
        path: "jobs",
        element: <JobRoot />,
        children: [
          { index: true, element: <Blank /> },
          {
            path: ":jobId",
            element: <Job.View />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Suspense>
      <AuthContextProvider>
        <JobContextProvider>
          <JobSaveContextProvider>
            <RouterProvider router={router} />
            <TailWindToaster />
          </JobSaveContextProvider>
        </JobContextProvider>
      </AuthContextProvider>
    </Suspense>
  </React.StrictMode>
);
