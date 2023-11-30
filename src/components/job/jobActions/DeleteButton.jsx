import { useRequest } from "ahooks";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { useJob } from "@/models";

import { useDashboard } from "../JobDashboard";

export default function DeleteButton({ jobId }) {
  const { deleteJob } = useJob();
  const dashboard = useDashboard();
  const navigate = useNavigate();
  const { run, loading } = useRequest(async (jobId) => deleteJob(jobId), {
    manual: true,
    onSuccess: async () => {
      if (dashboard === undefined) {
        toast.error("Please use Manage Job option to delete jobs!");
        return;
      }
      toast.success("Job deleted!");
      await dashboard.jobsRefresh();
      await dashboard.countRefresh();
      navigate("..", { replace: true });
    },
    onError: (error) => {
      toast.error(`"Job delete failed": ${error.message}`);
    },
  });
  return (
    <button
      className={`btn btn-error w-32 ${loading ? "loading" : ""}`}
      onClick={async () => run(jobId)}
      disabled={loading}
    >
      Delete
    </button>
  );
}
