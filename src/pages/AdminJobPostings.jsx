import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useState } from "react";
import database from "@/clients/firebase";
import { auth as firebaseAuth } from "@/clients/firebase";
import { JobView } from "@/components/JobView";
import { fetchJobs } from "@/functions/fetchJobs";

export default function AdminJobPostings() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, async (user) => {
        if (user) {
          const jobList = await fetchJobs(database, "admin",  "iKGlSJEUkWQjCHZMQhgrVixVAt42")
          setJobs(jobList.filter(job => job.status === "open"));
          setSelectedJob(jobList.length > 0 ? jobList[0] : null);
        }
      });
  }, []);

  const styleSheet = {
    card: {
      width: "30vw",
      borderRadius: "5px",
      marginTop: "25px",
    },
    cardColumn: {
      width: "40vw",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "start",
    },
    pageWrapper: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-evenly",
    },
  };

  return (
    <div style={styleSheet.pageWrapper}>
      <div style={styleSheet.cardColumn} className="bg-base-300">
        <h2>
          <strong>Review Requests ({jobs.length})</strong>
        </h2>
        {jobs.map((job) => (
          <div
            key={job.dateInput.seconds}
            style={styleSheet.card}
            className={job === selectedJob ? "card bg-accent" : "card bg-base-100"}
            onClick={() => setSelectedJob(job)}
          >
            <h2 className="card-title">{job.title}</h2>
            <div className="card-body">
              <ul>
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
              <button className="btn btn-success">Approve</button>
              <button className="btn btn-error">Reject</button>
            </div>
          </div>
        ))}
      </div>
      <JobView job={selectedJob} />
    </div>
  );
}
