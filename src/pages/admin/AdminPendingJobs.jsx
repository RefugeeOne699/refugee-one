import { useMemo, useState } from "react";

import { JobView } from "@/components/JobView";
import { useAdmin } from "@/models";

export default function AdminJobPostings() {
  const [selectedJob, setSelectedJob] = useState(null);

  const { pendingJobList: jobList } = useAdmin();

  const cards = useMemo(() => {
    // todo: use a spin for loading
    return jobList.length === 0 ? (
      <p className="text-lg">Loading</p>
    ) : (
      jobList?.map((job) => (
        <div
          key={job.id}
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
            <button className="btn btn-success">Approve</button>
            <button className="btn btn-error">Reject</button>
          </div>
        </div>
      ))
    );
  }, [jobList]);

  return (
    <div className="flex flex-row w-screen h-screen justify-evenly bg-base-300">
      <div className="flex flex-col w-half items-center overflow-scroll">
        {/* todo: @Ken please consider the behavior of the title when loading data */}
        <h2>
          <p className="text-xl text-bold">Review Requests ({jobList?.length})</p>
        </h2>
        {cards}
      </div>
      <JobView job={selectedJob} />
    </div>
  );
}
