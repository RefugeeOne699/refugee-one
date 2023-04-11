import { JOB_STATUS } from "@/constants";

import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";

export default function EmployerActions({ job, jobId }) {
  return (
    <div className="items-center text-center w-full flex flex-row justify-center gap-32">
      {job.status === JOB_STATUS.APPROVED ? <DeleteButton /> : null}
      <EditButton jobId={jobId} />
    </div>
  );
}
