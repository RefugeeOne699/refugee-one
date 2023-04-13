import { ROLES } from "@/constants";
import { useAuth } from "@/models";

import AdminActions from "./AdminActions";
import ClientActions from "./ClientActions";
import EmployerActions from "./EmployerActions";

export default function JobActions({ job, jobId }) {
  const auth = useAuth();
  const className =
    "items-center w-full flex flex-row justify-center pb-4 pt-4 bg-base-100 shadow-lg max-w-full";
  // a placeholder
  if (!job && !jobId) {
    return (
      <div className={`${className} invisible`}>
        <ClientActions jobId={jobId} />
      </div>
    );
  }
  return (
    <div className={`max-md:fixed bottom-0 ${className}`}>
      {auth.user.role === ROLES.ADMIN ? (
        <AdminActions job={job} jobId={jobId} />
      ) : auth.user.role === ROLES.EMPLOYER ? (
        <EmployerActions job={job} jobId={jobId} />
      ) : (
        <ClientActions jobId={jobId} />
      )}
    </div>
  );
}
