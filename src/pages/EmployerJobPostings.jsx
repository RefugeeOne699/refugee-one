import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";

import database from "@/clients/firebase";
import { auth as firebaseAuth } from "@/clients/firebase";
import { useAuth } from "@/models";

export default function EmployerJobPostings() {
  const [jobs, setJobs] = useState([]);
  const auth = useAuth();

  useEffect(() => {
    fetchOpenJobs();
  }, []);

  async function fetchOpenJobs() {
    // https://firebase.google.com/docs/firestore/query-data/queries
    // https://firebase.google.com/docs/auth/web/manage-users

    onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        if (auth.user.role === "Employer") {
          const jobOpenings = collection(database, "Jobs");
          const q = query(jobOpenings, where("owner", "==", `/Users/${user.uid}`));
          const querySnapshot = await getDocs(q);
          const toDisplay = [];
          querySnapshot.forEach((doc) => {
            toDisplay.push(doc.data());
          });
          setJobs(toDisplay);
        }
      }
    });
  }

  return (
    <ul>
      {jobs.map((job) => (
        <li key={job.postDate.nanoseconds}>
          <h2>{job.title}</h2>
          <ul>
            <li key={1}>{job.company}</li>
            <li key={2}>{job.description}</li>
            <li key={3}>{job.postDate.seconds}</li>
            <li key={4}>{job.availableUntil.seconds}</li>
          </ul>
          <div>
            <button className="btn">Approve</button>
            <button className="btn">Reject</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
