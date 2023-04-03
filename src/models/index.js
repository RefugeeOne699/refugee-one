import { useContext } from "react";

import { AdminContext } from "./admin";
import { AuthContext } from "./auth";
import { JobContext } from "./job";
import { JobSaveContext } from "./jobSave";
import { UserContext } from "./user";

const useAuth = () => useContext(AuthContext);
const useJob = () => useContext(JobContext);
const useAdmin = () => useContext(AdminContext);
const useJobSave = () => useContext(JobSaveContext);
const useUser = () => useContext(UserContext);
export { useAdmin, useAuth, useJob, useJobSave, useUser };
