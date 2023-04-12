import { Link } from "react-router-dom";

import JobSave from "@/components/job/JobSave";

export default function ClientActions({ jobId }) {
  return (
    <div className="items-center text-center w-full flex flex-row justify-center gap-32">
      <Link to=".." className="text-xl justify-start">
        <button className="btn btn-outline w-32">Back</button>
      </Link>
      <JobSave jobId={jobId} />
    </div>
  );
}
