import { useRequest } from "ahooks";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { JOB_STATUS } from "@/constants";
import { useJob } from "@/models";

import { useDashboard } from "../JobDashboard";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";

export default function AdminActions({ job, jobId }) {
  const [jobFeedback, setJobFeedback] = useState("");
  const { approveJob, rejectJob } = useJob();
  const navigate = useNavigate();
  const dashboard = useDashboard();

  const { run, loading } = useRequest(
    async (willApprove, jobId, feedback) => {
      if (willApprove) {
        await approveJob(jobId);
      } else {
        await rejectJob(jobId, feedback);
      }
    },
    {
      manual: true,
      onSuccess: async (_, params) => {
        if (dashboard === undefined) {
          return;
        }
        toast.success(`Job has been ${params[0] ? "approved" : "rejected"}!`);
        await dashboard.jobsRefresh();
        await dashboard.countRefresh();
        navigate("..", { replace: true });
      },
      onError: (error, params) => {
        toast.error(
          `Failed to ${params[0] ? "approve" : "reject"} job: ${error.message}`
        );
      },
    }
  );

  const reject = async () => {
    await run(false, jobId, jobFeedback);
  };

  const approve = async () => {
    await run(true, jobId);
  };

  const buttons = useMemo(() => {
    if (job.status === JOB_STATUS.PENDING) {
      return (
        <>
          <label
            htmlFor="feedback-display"
            className={`btn btn-error w-32 ${loading ? "loading btn-disabled" : ""}`}
          >
            Reject
          </label>
          <EditButton jobId={jobId} disabled={loading} />
          <button
            onClick={approve}
            className={`btn btn-success w-32 ${loading ? "loading btn-disabled" : ""}`}
          >
            Approve
          </button>
        </>
      );
    }

    if (job.status === JOB_STATUS.APPROVED) {
      return (
        <>
          <DeleteButton jobId={jobId} />
          <EditButton jobId={jobId} />
        </>
      );
    }

    if (job.status === JOB_STATUS.REJECTED) {
      return <DeleteButton jobId={jobId} />;
    }
    return null;
  }, [job.status, loading]);

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
