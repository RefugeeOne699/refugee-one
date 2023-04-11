import { useRequest } from "ahooks";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import { JOB_STATUS } from "@/constants";
import { useJob } from "@/models";

import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";

export default function JobApproveReject({ job }) {
  const [jobFeedback, setJobFeedback] = useState("");
  const { approveJob, rejectJob } = useJob();
  const approveJobRequest = useRequest(async () => approveJob(job.id), {
    manual: true,
    onSuccess: () => {
      toast.success("Job has been approved!");
    },
    onError: () => {
      toast.error("Failed to approve job");
    },
  });

  const rejectJobRequest = useRequest(async () => rejectJob(job.id, jobFeedback), {
    manual: true,
    onSuccess: () => {
      toast.success("Job has been rejected!");
    },
    onError: () => {
      toast.error("Failed to reject job");
    },
  });

  const reject = async () => {
    await rejectJobRequest.run(job.id, jobFeedback);
  };

  const approve = async () => {
    await approveJobRequest.run(job.id);
  };

  const buttons = useMemo(() => {
    if (job.status === JOB_STATUS.PENDING) {
      return (
        <>
          <label htmlFor="feedback-display" className="btn btn-error w-32">
            Reject
          </label>
          <EditButton />
          <button onClick={approve} className="btn btn-success w-32">
            Approve
          </button>
        </>
      );
    }

    if (job.status === JOB_STATUS.APPROVED) {
      return (
        <>
          <DeleteButton />
          <EditButton />
        </>
      );
    }

    if (job.status === JOB_STATUS.REJECTED) {
      return <button className="btn btn-error w-32">Delete</button>;
    }
    return null;
  }, [job.status]);

  return (
    <>
      <div className="items-center text-center w-full flex flex-row justify-center gap-32">
        {buttons}
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
