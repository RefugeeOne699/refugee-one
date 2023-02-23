import { useContext } from "react";

import { AuthContext } from "./auth";
import db from "./database";

const useAuth = () => useContext(AuthContext);
//const useDB = () => useContext(DBContext);

export { useAuth };
export { db };
