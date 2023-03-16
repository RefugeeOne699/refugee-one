import { useRequest } from "ahooks";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

import { useJob } from "@/models";

export default function JobView() {
  const { jobId } = useParams();
  const { getJob } = useJob();
  if (!jobId) {
    // todo: add an error page
    return <p className="text-bold text-3xl">404 not found.</p>;
  }
  const { run, data, loading } = useRequest(async () => getJob(jobId), {
    manual: true,
    onError: () => {
      alert("unable to get the job");
    },
  });

  useEffect(() => {
    (async () => {
      await run();
    })();
  }, [jobId]);

  const content = useMemo(() => {
    if (loading) {
      return <p>loading</p>;
    }
    return data ? (
      <div className="flex flex-col">
        <p className="text-bold text-2xl">{data.title}</p>
        {`I am at src/components/job/JovView. This is job ${jobId}. `}
        {JSON.stringify(data)}
      </div>
    ) : (
      <p>Nothing</p>
    );
  }, [data, loading]);

  // todo: job details
  return content;
}
