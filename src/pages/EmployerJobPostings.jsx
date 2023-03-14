import { useRequest } from "ahooks";
import { where } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

import { JobView } from "@/components/JobView";
import { useAuth, useJob } from "@/models";

export default function EmployerJobPostings() {
  const [selectedJob, setSelectedJob] = useState(null);
  const { getJobs } = useJob();
  const auth = useAuth();
  const {
    run,
    loading,
    data: jobs,
  } = useRequest(async () => getJobs(where("owner", "==", auth.userRef)), {
    manual: true,
  });

  useEffect(() => {
    if (auth.user && auth.userRef) {
      (async () => {
        await run();
      })();
    }
  }, []);

  const cards = useMemo(
    () =>
      jobs
        ? jobs.map((job) => (
            <div
              key={job.dateInput.seconds}
              className={
                job === selectedJob
                  ? "card bg-accent w-9/12 mt-5"
                  : "card bg-base-100 w-9/12 mt-5"
              }
              onClick={() => setSelectedJob(job)}
            >
              <h2 className="card-title">{job.title}</h2>
              <div className="card-body">
                <ul>
                  <li key={0}>
                    <strong>Status: </strong>
                    {job.status}
                  </li>
                  <li key={1}>
                    <strong>Company: </strong>
                    {job.company.name}
                  </li>
                  <li key={2}>
                    <strong>Poster: </strong>
                    {job.owner.name}
                  </li>
                  {/* <li key={3}>
                    <strong>Posted: </strong>
                    {`${new Date(job.dateInput.seconds * 1000)}`}
                  </li> */}
                </ul>
              </div>
              <div className="card-actions buttonRow">
                <button className="btn btn-error">Request Removal</button>
              </div>
            </div>
          ))
        : "Loading",
    [jobs, loading]
  );

  return (
    <div className="flex flex-row w-screen h-screen justify-evenly bg-base-300">
      <div className="flex flex-col w-half items-center overflow-scroll">
        <h2>
          <strong>Review Requests ({jobs?.length})</strong>
        </h2>
        {cards}
      </div>
      <JobView job={selectedJob} />
    </div>
  );
}
