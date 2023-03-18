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
    console.log(data)
    return data ? (
      <div className="flex flex-col card">
        <div className="card-body items-center">
            <p className="card-title text-2xl">{data.title}</p>
            <p className="text-bold text-1xl">{data.company.name}</p>
            <p className="text-bold text-1xl">Posted: {`${new Date(data.datePost.seconds*1000)}`}</p>
          <div className="flex flex-row w-full">
            <div className="w-1/2">
              <p>Starting Date:</p>
            </div>
            <div className="w-1/2">
              <p>Job Type:</p>
            </div>
          </div>
          <div className="flex flex-row">
            <div className="w-1/2"></div>
            <div className="w-1/2"></div>
          </div>
          <div className="flex flex-row">
            <div className="w-1/2"></div>
            <div className="w-1/2"></div>
          </div>
          <div className="flex flex-row">
          </div>
          <div className="flex flex-row">
          </div>
          <div className="flex flex-row">
          </div>
        </div>
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
