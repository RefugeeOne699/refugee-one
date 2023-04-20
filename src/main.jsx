import "./index.css";

import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from "react-router-dom";

import JobRoot from "@/components/job/JobRoot";
import ProfileRoot from "@/pages/Profile";

import AppRoot from "./App";
import RequireEmployer from "./components/acess/RequireEmployer";
import SavedJobRoot from "./components/job/SavedJobRoot";
import TailWindToaster from "./components/TailwindToaster";
import { AdminContextProvider } from "./models/admin";
import { AuthContextProvider, RequireAuth } from "./models/auth";
import { JobContextProvider } from "./models/job";
import { JobSaveContextProvider } from "./models/jobSave";

const Admin = {
  AccountCreate: lazy(async () => import("@/pages/admin/AccountCreate")),
  Users: lazy(async () => import("@/pages/admin/UsersAdmin")),
};
const UpsertJob = lazy(async () => import("@/components/job/UpsertJob"));

const SignUp = lazy(async () => import("@/pages/SignUp"));
const SignIn = lazy(async () => import("@/pages/SignIn"));
const ForgetPassword = lazy(async () => import("@/pages/ForgetPassword"));
const ConfirmSendEmail = lazy(async () => import("@/pages/ConfirmSendEmail"));
const SetPassword = lazy(async () => import("@/pages/SetPassword"));
const Center = lazy(async () => import("@/components/Center"));
const Job = {
  View: lazy(async () => import("@/components/job/JobView")),
  Dashboard: lazy(async () => import("@/components/job/JobDashboard")),
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
  {
    path: "/set_password",
    element: <SetPassword />,
  },
  {
    path: "/forget_password",
    element: <ForgetPassword />,
  },
  {
    path: "/confirm_send_email",
    element: <ConfirmSendEmail />,
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
        // pending employer user can access this
        element: <UpsertJob />,
      },
      {
        path: "updateJob/:jobId",
        element: (
          <RequireAuth strict={true}>
            <UpsertJob update={true} />
          </RequireAuth>
        ),
      },
      // example: example for router and nested router
      {
        path: "admin",
        element: (
          <RequireAuth strict={true}>
            <AdminContextProvider>
              <Outlet />
            </AdminContextProvider>
          </RequireAuth>
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
                element: <Job.Dashboard role="admin" />,
                children: [
                  { index: true, element: <Job.View /> },
                  {
                    path: ":jobId",
                    element: <Job.View />,
                  },
                ],
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
          {
            path: "users",
            children: [
              {
                index: true,
                element: <Navigate to="client" />,
              },
              {
                path: ":tabUrl",
                element: <Admin.Users />,
              },
            ],
          },
        ],
      },
      {
        path: "employer",
        element: (
          <RequireAuth strict={true}>
            <RequireEmployer>
              <Outlet />
            </RequireEmployer>
          </RequireAuth>
        ),
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
                element: <Job.Dashboard role="employer" />,
                children: [
                  { index: true, element: <Job.View /> },
                  {
                    path: ":jobId",
                    element: <Job.View />,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "jobs",
        element: (
          <RequireAuth strict={true}>
            <JobRoot />
          </RequireAuth>
        ),
        children: [
          { index: true, element: <Job.View /> },
          {
            path: ":jobId",
            element: <Job.View />,
          },
        ],
      },
      {
        path: "jobsSaved",
        element: (
          <RequireAuth strict={true}>
            <SavedJobRoot />
          </RequireAuth>
        ),
        children: [
          { index: true, element: <Job.View /> },
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
