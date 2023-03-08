import { useEffect } from "react";
import { useState } from "react";

import database from "@/clients/firebase";
import { JobView } from "@/components/JobView";
import { fetchJobs } from "@/functions/fetchJobs";
import { useAuth } from "@/models";

export default function AdminJobPostings() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const auth = useAuth();

  useEffect(() => {
    if (auth) {
      getJobs();
    }
  }, []);

  const getJobs = async () => {
    const jobList = await fetchJobs(database, "owner", auth.user.uid);
    setJobs(jobList);
    setSelectedJob(jobList.length > 0 ? jobList[0] : null);
  };

  return (
    <div className="flex flex-row w-screen h-screen justify-evenly bg-base-300">
      <div className="flex flex-col w-half items-center overflow-scroll">
        <h2>
          <strong>Review Requests ({jobs.length})</strong>
        </h2>
        {jobs.map((job) => (
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
                  {job.parsedCompany.name}
                </li>
                <li key={2}>
                  <strong>Poster: </strong>
                  {job.parsedOwner.name}
                </li>
                <li key={3}>
                  <strong>Posted: </strong>
                  {`${new Date(job.dateInput.seconds * 1000)}`}
                </li>
              </ul>
            </div>
            <div className="card-actions buttonRow">
              <button className="btn btn-error">Request Removal</button>
            </div>
          </div>
        ))}
      </div>
      <JobView job={selectedJob} />
    </div>
  );
}
