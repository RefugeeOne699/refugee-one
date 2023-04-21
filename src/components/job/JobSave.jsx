import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { useRequest } from "ahooks";
import { useMemo } from "react";
import { toast } from "react-hot-toast";

import Spin from "@/components/Spin";
import { useAuth, useJobSave } from "@/models";

import Center from "../Center";

export default function JobSave({ jobId, mode }) {
  const {
    jobsSaved,
    saveJob,
    checkIsJobSaved,
    jobsSavedLoading: checking,
  } = useJobSave();
  const auth = useAuth();
  const { uid } = auth.user;
  const saveJobRequest = useRequest(async () => saveJob(jobId, uid), {
    manual: true,
    debounceWait: 100,
    onSuccess: (outcome) => {
      toast.success(`Job is ${outcome ? "saved" : "unsaved"}!`);
    },
    onError: (error) => {
      toast.error("Failed to save the job: " + error.message);
    },
  });
  const onClick = async () => {
    await saveJobRequest.run(jobId, uid);
  };

  const loading = saveJobRequest.loading || checking;
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
    }, [loading, jobsSaved]);

    return <Center className="text-4xl">{starIcon}</Center>;
  } else {
    const button = useMemo(() => {
      return (
        <button
          onClick={onClick}
          className={`btn btn-primary ${loading ? "loading" : ""} w-32`}
          disabled={loading}
        >
          {loading ? "Loading" : checkIsJobSaved(jobId) ? "Unsave" : "Save"}
        </button>
      );
    }, [loading, jobsSaved]);
    return button;
  }
}
