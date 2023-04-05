import { useContext } from "react";

import { AdminContext } from "./admin";
import { AuthContext } from "./auth";
import { JobContext } from "./job";
import { JobSaveContext } from "./jobSave";
import { PositionContext } from "./position";

const useAuth = () => useContext(AuthContext);
const useJob = () => useContext(JobContext);
const useAdmin = () => useContext(AdminContext);
const useJobSave = () => useContext(JobSaveContext);
const usePosition = () => useContext(PositionContext);
export { useAdmin, useAuth, useJob, useJobSave, usePosition };
