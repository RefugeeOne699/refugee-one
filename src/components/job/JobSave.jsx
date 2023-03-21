import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

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
  const { jobId: jobIdUrl } = useParams();
  const { uid } = auth.user;
  // only trick onClick when the job page/item in the list is active
  const onClick = async () => {
    if (jobIdUrl && jobId === jobIdUrl) {
      await saveJob.run(jobId, uid);
    }
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
