import { useState } from "react";
import { useJob } from "@/models";

export default function JobApproveReject({ jobId }) {
  const [hideFeedback, sethideFeedback] = useState(true);
  const [jobFeedback, setJobFeedback] = useState("");
  const { approveJob, rejectJob } = useJob();

  return (
    <>
    <div className="items-center text-center w-3/4">
        <div className="w-full flex flex-row justify-center">
          <label htmlFor="feedback-display" className="btn btn-error">
            Reject
          </label>
          <button
            onClick={() => {
              approveJob(jobId);
            }}
            className="btn btn-success ml-5"
          >
            Approve
          </button>
        </div>
    </div>
    {/*https://daisyui.com/components/modal/# */}
    <input type="checkbox" id="feedback-display" className="modal-toggle" />
    <label htmlFor="feedback-display" className="modal cursor-pointer">
      <label className="modal-box relative" htmlFor="">
        <div className="w-full">
          <label className="label">
            <span className="label-text">Reason for Rejection (Not Required)</span>
          </label>
          <textarea
            onChange={(e) => setJobFeedback(e.target.value)}
            className="textarea textarea-bordered w-full"
          ></textarea>
        </div>
        <div className="w-full flex flex-row justify-center mt-5">
          <label htmlFor="feedback-display" className="btn btn-primary mr-5">
            Back
          </label>
          <button onClick={() => rejectJob(jobId, jobFeedback)} className="btn btn-error">
            Reject
          </button>
        </div>
      </label>
    </label>
    </>
  );
}
