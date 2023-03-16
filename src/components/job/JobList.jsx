import { useRequest } from "ahooks";
import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import { useAuth, useJob } from "@/models";

export default function JobList() {
  const { listJobs } = useJob();
  const { jobId } = useParams();
  const { run, data } = useRequest(async () => listJobs(), {
    manual: true,
  });
  const auth = useAuth();

  useEffect(() => {
    if (auth.user) {
      (async () => {
        await run();
      })();
    }
  }, []);

  const jobs = useMemo(() => {
    return data
      ? data.map((job) => {
          return (
            <li key={job.id}>
              <Link to={job.id} className={job.id && job.id == jobId ? "active" : null}>
                <div className="card card-side w-full">
                  <figure>LOGO</figure>
                  <div className="card-body">
                    <p className="card-title text-xl">{job.title}</p>
                    <p>{job.company.name}</p>
                  </div>
                </div>
              </Link>
            </li>
          );
        })
      : "Loading";
  }, [data, jobId]);

  return (
    <div className="flex flex-row">
      <ul className="menu w-full">{jobs}</ul>
    </div>
  );
}
