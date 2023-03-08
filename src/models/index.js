import { useContext } from "react";

import { AuthContext } from "./auth";
import { ProfileContext } from "./profile";

const useAuth = () => useContext(AuthContext);
const useProfile = () => useContext(ProfileContext);

export { useAuth };
export { useProfile };
