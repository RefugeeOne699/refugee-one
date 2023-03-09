import { useContext } from "react";

import { AuthContext } from "./auth";
import { JobContext } from "./job";

const useAuth = () => useContext(AuthContext);
const useJob = () => useContext(JobContext);

export { useAuth, useJob };
