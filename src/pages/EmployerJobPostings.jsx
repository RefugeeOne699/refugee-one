import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";

import database from "@/clients/firebase";
import { auth as firebaseAuth } from "@/clients/firebase";

export default function EmployerJobPostings() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchOpenJobs();
  }, []);

  async function fetchOpenJobs() {
    // https://firebase.google.com/docs/firestore/query-data/queries
    // https://firebase.google.com/docs/auth/web/manage-users

    onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        const jobOpenings = collection(database, "Jobs");
        const q = query(jobOpenings, where("owner", "==", `/Users/${user.uid}`));
        const querySnapshot = await getDocs(q);
        const toDisplay = [];
        querySnapshot.forEach((doc) => {
          toDisplay.push(doc.data());
        });
        setJobs(toDisplay);
      }
    });
  }

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
  };

  return (
    <div style={styleSheet.cardColumn} className="bg-base-300">
      <h2>
        <strong>Your Jobs ({jobs.length})</strong>
      </h2>
      {jobs.map((job) => (
        <div
          key={job.postDate.nanoseconds}
          style={styleSheet.card}
          className="card bg-base-100"
        >
          <h2 className="card-title">{job.title}</h2>
          <div className="card-body">
            <ul>
              <li key={1}>
                <strong>Status: </strong>
                {job.status}
              </li>
              <li key={2}>
                <strong>Description: </strong>
                {job.description}
              </li>
              <li key={3}>
                <strong>Posted: </strong>
                {`${new Date(job.postDate.seconds * 1000)}`}
              </li>
              <li key={4}>
                <strong>Available Till: </strong>
                {`${new Date(job.availableUntil.seconds * 1000)}`}
              </li>
            </ul>
          </div>
          <div className="card-actions buttonRow">
            <button className="btn btn-error">Request Removal</button>
          </div>
        </div>
      ))}
    </div>
  );
}
