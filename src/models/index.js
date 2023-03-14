import { useContext } from "react";

import { AdminContext } from "./admin";
import { AuthContext } from "./auth";
import { JobContext } from "./job";

const useAuth = () => useContext(AuthContext);
const useJob = () => useContext(JobContext);
const useAdmin = () => useContext(AdminContext);

export { useAdmin, useAuth, useJob };
