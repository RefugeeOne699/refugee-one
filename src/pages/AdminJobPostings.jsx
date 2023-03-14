import { useEffect } from "react";
import { useState } from "react";

import database from "@/clients/firebase";
import { JobView } from "@/components/JobView";
import { fetchJobs } from "@/functions/fetchJobs";
import { useAuth } from "@/models";
import { useJob } from "@/models";

export default function AdminJobPostings() {
  // consider changing useJob to just a module to import
  const jobFunctions = useJob();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  // states for approve and reject alert/overlay and also the reject message
  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [rejectMessage, setRejectMessage] = useState("");
  const [rejectJobId, setRejectJobId] = useState(undefined);

  const auth = useAuth();

  useEffect(() => {
    if (auth) {
      getJobs();
    }
  }, []);

  const getJobs = async () => {
    const jobList = await fetchJobs(database, "admin", null);
    const filteredJobs = jobList.filter((job) => job.status === "pending");
    setJobs(filteredJobs);
    setSelectedJob(filteredJobs.length > 0 ? jobList[0] : null);
    // console.log(jobs[0])
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
              <label
                className="btn btn-success"
                onClick={async () => {
                  jobFunctions.approveJob(job.jobId);
                  setShowApprove(true);
                  setTimeout(() => {
                    setShowApprove(false);
                  }, 1000);
                }}
              >
                Approve
              </label>
              <label
                htmlFor="reject-modal"
                className="btn btn-error"
                onClick={() => setRejectJobId(job.jobId)}
              >
                Reject
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* Approval Alert */}
      {/* Out-of-box alert from DaisyUI - see https://daisyui.com/components/alert/ */}
      {showApprove ? (
        <div className="absolute alert alert-success shadow-lg w-1/4">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Job Approved!</span>
          </div>
        </div>
      ) : null}

      {/* Reject Modal */}
      {/* Out-of-box modal from DaisyUI - see https://daisyui.com/components/modal/#modal-using-label--hidden-checkbox */}
      <input type="checkbox" id="reject-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box gap-10">
          <h3 className="font-bold text-lg">Reject Job Listing</h3>
          <textarea
            type="text"
            rows="3"
            placeholder="Please write down reason for the rejection."
            value={rejectMessage}
            onChange={(e) => setRejectMessage(e.target.value)}
            className="textarea textarea-bordered w-full mt-2"
          />
          <div className="modal-action">
            <label
              htmlFor="reject-modal"
              className="btn btn-ghost"
              onClick={() => {
                setRejectMessage("");
                setRejectJobId(undefined);
              }}
            >
              Cancel
            </label>
            <label
              htmlFor="reject-modal"
              className="btn"
              onClick={() => {
                jobFunctions.rejectJob(rejectJobId, rejectMessage);
                setRejectMessage("");
                setRejectJobId(undefined);
              }}
            >
              Reject
            </label>
          </div>
        </div>
      </div>

      <JobView job={selectedJob} />
    </div>
  );
}
