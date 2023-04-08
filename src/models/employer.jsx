import {
  // eslint-disable-next-line no-unused-vars
  QueryConstraint,
} from "firebase/firestore";
import { createContext, useMemo } from "react";
import { Navigate } from "react-router-dom";

import { ROLES } from "@/constants";

import { useAuth } from ".";

const EmployerContext = createContext({});

const EmployerContextProvider = ({ children }) => {
  // todo: somewhere deny access, should be in main.jsx
  //   if (auth.user.role !== ROLES.ADMIN) {
  //     console.error("?");
  //   }
  const value = useMemo(() => ({}), []);

  return <EmployerContext.Provider value={value}>{children}</EmployerContext.Provider>;
};

const RequireEmployer = ({ children }) => {
  const auth = useAuth();
  if (auth.user.role === ROLES.EMPLOYER) {
    return children;
  } else {
    // todo: add an error page for non-admin access
    return <Navigate to="/" replace />;
  }
};

export { EmployerContext, EmployerContextProvider, RequireEmployer };
