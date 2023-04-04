import { useRequest } from "ahooks";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { useJob } from "@/models";

export default function JobApproveReject({ jobId }) {
  const [jobFeedback, setJobFeedback] = useState("");
  const { approveJob, rejectJob } = useJob();

  const approveJobRequest = useRequest(async () => approveJob(jobId), {
    manual: true,
    onSuccess: () => {
      toast.success("Job has been approved!");
    },
    onError: () => {
      toast.error("Failed approve job");
    },
  });

  const rejectJobRequest = useRequest(async () => rejectJob(jobId, jobFeedback), {
    manual: true,
    onSuccess: () => {
      toast.error("Job has been rejected!");
    },
    onError: () => {
      toast.error("Failed to reject job");
    },
  });

  const reject = async () => {
    rejectJobRequest.run(jobId, jobFeedback);
  };

  const approve = async () => {
    approveJobRequest.run(jobId);
  };

  return (
    <>
      <div className="items-center text-center w-3/4">
        <div className="w-full flex flex-row justify-center">
          <label htmlFor="feedback-display" className="btn">
            Reject
          </label>
          <button
            onClick={() => {
              approve();
            }}
            className="btn btn-primary ml-5"
          >
            Approve
          </button>
        </div>
      </div>
      {/*https://daisyui.com/components/modal/# */}
      <input type="checkbox" id="feedback-display" className="modal-toggle" />
      <label htmlFor="feedback-display" className="modal cursor-pointer">
        <label className="modal-box relative">
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
            <label htmlFor="feedback-display" className="btn mr-5">
              Back
            </label>
            <label
              htmlFor="feedback-display"
              onClick={() => reject()}
              className="btn btn-primary"
            >
              Reject
            </label>
          </div>
        </label>
      </label>
    </>
  );
}
