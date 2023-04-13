import { Navigate } from "react-router-dom";

import { ROLES } from "@/constants";
import { useAuth } from "@/models";

export default function RequireEmployer({ children }) {
  const auth = useAuth();
  if (auth.user.role === ROLES.EMPLOYER) {
    return children;
  } else {
    // todo: add an error page for non-employer access
    return <Navigate to="/" replace />;
  }
}
