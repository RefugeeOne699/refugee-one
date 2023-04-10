import "./index.css";

import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from "react-router-dom";

import JobRoot from "@/pages/Job";
import ProfileRoot from "@/pages/Profile";

import AppRoot from "./App";
import TailWindToaster from "./components/TailwindToaster";
import { AdminContextProvider } from "./models/admin";
import { AuthContextProvider } from "./models/auth";
import { JobContextProvider } from "./models/job";
import { JobSaveContextProvider } from "./models/jobSave";

const AddJob = lazy(async () => import("@/pages/AddJob"));
const Admin = {
  Jobs: lazy(async () => import("@/pages/admin/JobsAdmin")),
  AccountCreate: lazy(async () => import("@/pages/admin/AccountCreate")),
};

const SignUp = lazy(async () => import("@/pages/SignUp"));
const SignIn = lazy(async () => import("@/pages/SignIn"));
const Center = lazy(async () => import("@/components/Center"));
const Job = {
  View: lazy(async () => import("@/components/job/JobView")),
};
const Profile = {
  Menu: lazy(async () => import("@/components/profile/ProfileMenu")),
  Help: lazy(async () => import("@/components/profile/ProfileHelp")),
  Account: lazy(async () => import("@/components/profile/ProfileAccount")),
  SetProfile: lazy(async () => import("@/components/profile/ProfileSetProfile")),
  SetPassword: lazy(async () => import("@/components/profile/ProfileSetPassword")),
};

const router = createBrowserRouter([
  {
    path: "/signIn",
    element: <SignIn />,
  },
  {
    path: "/signUp",
    element: <SignUp />,
  },
  // all the pages below requires signed in
  {
    path: "/",
    element: <AppRoot />,
    // todo: error page
    // errorElement: <ErrorBoundary />,
    children: [
      // TODO: home page
      {
        index: true,
        element: <Center />,
      },
      {
        path: "addJob",
        element: <AddJob />, //add job listing
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
            path: "jobs",
            children: [
              {
                index: true,
                element: <Navigate to="pending" />,
              },
              {
                path: ":tabUrl",
                element: <Admin.Jobs />,
              },
            ],
          },
          {
            path: "accounts",
            children: [
              {
                path: "create",
                element: <Admin.AccountCreate />,
              },
            ],
          },
        ],
      },
      {
        path: "jobs",
        element: <JobRoot />,
        children: [
          { index: true, element: <Center /> },
          {
            path: ":jobId",
            element: <Job.View />,
          },
        ],
      },
      {
        path: "profile",
        element: <ProfileRoot />,
        children: [
          { index: true, element: <Profile.Menu /> },
          {
            path: "account",
            element: <Profile.Account />,
          },
          {
            path: "help",
            element: <Profile.Help />,
          },
          {
            path: "set_profile",
            element: <Profile.SetProfile />,
          },
          {
            path: "set_password",
            element: <Profile.SetPassword />,
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
