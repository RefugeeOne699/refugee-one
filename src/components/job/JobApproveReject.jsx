import { useState } from "react";

import { useJob } from "@/models";

export default function JobApproveReject({ jobId }) {
  const [hideFeedback, sethideFeedback] = useState(true);
  const [jobFeedback, setJobFeedback] = useState("");
  const { approveJob, rejectJob } = useJob();

  return (
    <div className="items-center text-center w-3/4">
      {hideFeedback ? (
        ""
      ) : (
        <div className="w-full">
          <label className="label">
            <span className="label-text">Reason for Rejection (Not Required)</span>
          </label>
          <textarea
            onChange={(e) => setJobFeedback(e.target.value)}
            className="textarea textarea-bordered w-full"
          ></textarea>
        </div>
      )}
      {hideFeedback ? (
        <div className="w-full flex flex-row justify-center">
          <button onClick={() => sethideFeedback(false)} className="btn btn-error">
            Reject
          </button>
          <button
            onClick={() => {
              approveJob(jobId);
            }}
            className="btn btn-success ml-5"
          >
            Approve
          </button>
        </div>
      ) : (
        <div className="mt-5">
          <button onClick={() => sethideFeedback(true)} className="btn btn-warning">
            Undo
          </button>
          <button
            onClick={() => {
              rejectJob(jobId, jobFeedback);
            }}
            className="btn btn-error ml-5"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
