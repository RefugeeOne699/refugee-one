import {
  // eslint-disable-next-line no-unused-vars
  QueryConstraint,
} from "firebase/firestore";
import { createContext, useMemo } from "react";
import { Navigate } from "react-router-dom";

import { ROLES } from "@/constants";

import { useAuth } from ".";

const AdminContext = createContext({});

const AdminContextProvider = ({ children }) => {
  // todo: somewhere deny access, should be in main.jsx
  //   if (auth.user.role !== ROLES.ADMIN) {
  //     console.error("?");
  //   }
  const value = useMemo(() => ({}), []);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

const RequireAdmin = ({ children }) => {
  const auth = useAuth();
  if (auth.user.role === ROLES.ADMIN) {
    return children;
  } else {
    // todo: add an error page for non-admin access
    return <Navigate to="/" replace />;
  }
};

export { AdminContext, AdminContextProvider, RequireAdmin };
