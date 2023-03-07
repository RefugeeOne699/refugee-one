import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";

import database from "@/clients/firebase";
import { auth as firebaseAuth } from "@/clients/firebase";
import {JobView} from "@/components/JobView";

export default function AdminJobPostings() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);


  useEffect(() => {
    fetchOpenJobs();
  }, []);

  async function fetchOpenJobs() {
    // https://firebase.google.com/docs/firestore/query-data/queries
    // https://firebase.google.com/docs/auth/web/manage-users
    // https://stackoverflow.com/questions/47743082/waiting-for-a-foreach-to-finish-before-return-from-my-promise-function

    onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        const jobOpenings = collection(database, "Jobs");
        const q = query(jobOpenings, where("status", "==", "open"));
        const querySnapshot = await getDocs(q);
        const jobList = [];
        const owners = []
        querySnapshot.forEach( doc => {
            const data = doc.data()
            owners.push(getDoc(data.owner))
            jobList.push(data)
        })
        const companies = []
        const retrievedOwners = await Promise.all(owners)
        retrievedOwners.forEach((owner,i) => {
            const parsedOwner = owner.data()
            jobList[i].parsedOwner = parsedOwner
            companies.push(getDoc(parsedOwner.company))
        })
        const retrievedCompanies = await Promise.all(companies)
        retrievedCompanies.forEach((company,i) => {
            const parsedCompany = company.data()
            jobList[i].parsedCompany = parsedCompany
        })
        setJobs(jobList)
        console.log(jobList[0])
        setSelectedJob(jobList.length > 0 ? jobList[0] : null)
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
    pageWrapper:{
        display: "flex",
        flexDirection:"row",
        width: "100%",
        justifyContent: "space-evenly"
    }
  };

  return (
    <div style={styleSheet.pageWrapper}>
        <div style={styleSheet.cardColumn} className="bg-base-300">
            <h2>
                <strong>Review Requests ({jobs.length})</strong>
            </h2>
            {jobs.map((job) =>
                <div
                key={job.dateInput.seconds}
                style={styleSheet.card}
                className={job===selectedJob ? "card bg-accent" : "card bg-base-100"}
                onClick={()=>setSelectedJob(job)}
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
                        {job.parsedOwner.owner}
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
                )}
        </div>
        <JobView job={selectedJob}/>
    </div>
  );
}
