import { useContext } from "react";

import { AuthContext } from "./auth";
import { JobContext } from "./job";
import { ProfileContext } from "./profile";

const useAuth = () => useContext(AuthContext);
const useProfile = () => useContext(ProfileContext);

export { useAuth, useProfile, useJob };