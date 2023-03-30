import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { useRequest } from "ahooks";
import { useMemo } from "react";

import Spin from "@/components/Spin";
import { useAuth, useJobSave } from "@/models";

export default function JobSave({ jobId, mode }) {
  const {
    jobsSaved,
    saveJob,
    checkIsJobSaved,
    jobsSavedLoading: checking,
  } = useJobSave();
  const auth = useAuth();
  const { uid } = auth.user;
  const saveJobRequest = useRequest(async () => saveJob.run(jobId, uid), {
    manual: true,
    // todo: alert success message here
    onSuccess: () => {},
  });
  const onClick = async () => {
    await saveJobRequest.run(jobId, uid);
  };

  const loading = saveJob.loading || checking;
  if (mode === "list") {
    const starIcon = useMemo(() => {
      if (loading) {
        return <Spin className="h-8 w-8" />;
      }
      if (checkIsJobSaved(jobId)) {
        return <StarIcon fontSize="inherit" onClick={onClick} />;
      } else {
        return <StarOutlineIcon fontSize="inherit" onClick={onClick} />;
      }
    }, [saveJob.loading, checking, jobsSaved]);

    return <div className="text-4xl">{starIcon}</div>;
  } else {
    const button = useMemo(() => {
      return (
        <button
          onClick={onClick}
          className={`btn btn-success ${loading ? "loading" : ""}`}
          disabled={loading}
        >
          {loading ? "Loading" : checkIsJobSaved(jobId) ? "Unsave" : "Save"}
        </button>
      );
    }, [saveJob.loading, checking, jobsSaved]);
    return button;
  }
}