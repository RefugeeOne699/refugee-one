import { useEffect } from "react";
import { useState } from "react";

import database from "@/clients/firebase";
import { JobView } from "@/components/JobView";
import { fetchJobs } from "@/functions/fetchJobs";
import { useAuth } from "@/models";
import { collection, doc, getDoc, getDocs, setDoc, where } from "firebase/firestore";

export default function UserJobPage() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const auth = useAuth();

  useEffect(() => {
    if (auth) {
      getJobs();
    }
  }, []);

  const getJobs = async () => {
    const jobList = await fetchJobs(database, "User", null);
    const fetchEmployee = await getDoc(doc(database, "Users", auth.user.uid));
    const employee = fetchEmployee.data();
    setJobs(jobList.filter((job) => !employee.jobs.includes(job.id)));
    setSelectedJob(jobList.length > 0 ? jobList[0] : null);
  };

  const saveJob = async (jobId) => {
    await setDoc(doc(database, "Users", auth.user.uid), {
      ...auth.user,
      jobs: [...auth.user.jobs, jobId],
    });
    await getJobs();
  };

  return (
    <div className="flex flex-row w-screen h-screen justify-evenly bg-base-300">
      <div className="flex flex-col w-half items-center overflow-scroll">
        <h2>
          <strong>Open Positions ({jobs.length})</strong>
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
              <button onClick={() => saveJob(job.id)} className="btn btn-success">
                Save Job
              </button>
            </div>
          </div>
        ))}
      </div>
      <JobView job={selectedJob} />
    </div>
  );
}
