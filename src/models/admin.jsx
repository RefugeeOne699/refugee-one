import {
  // eslint-disable-next-line no-unused-vars
  QueryConstraint,
} from "firebase/firestore";
import { createContext, useMemo } from "react";

const AdminContext = createContext({});

const AdminContextProvider = ({ children }) => {
  // todo: somewhere deny access, should be in main.jsx
  //   if (auth.user.role !== "admin") {
  //     console.error("?");
  //   }
  const value = useMemo(() => ({}), []);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export { AdminContext, AdminContextProvider };
