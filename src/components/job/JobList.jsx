import { useRequest } from "ahooks";
import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import { useAuth, useJob } from "@/models";

import JobSave from "./JobSave";

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
            <li
              className="flex flex-row w-full mt-5 rounded-xl border-slate-400 border-4 "
              key={job.id}
            >
              <Link
                to={job.id}
                className={`${job.id && job.id == jobId ? "active" : ""} w-full`}
              >
                <div className="card card-compact w-full flex flex-row justify-between">
                  <div className="card-body basis-9/12 flex-none">
                    <div className="card-title text-xl">{job.title}</div>
                    <div className="flex flex-row flex-none">
                      <div className="flex flex-row flex-wrap flex-auto">
                        <p className="truncate w-1/2">{job.company.name}</p>
                        <p className="truncate w-1/2">{`${job.location}`}</p>
                        <p className="truncate w-1/2">
                          {job.benefits.hasMedical
                            ? "Medical Benefits"
                            : "No Medical Benefits"}
                        </p>
                        <p className="truncate w-1/2">
                          Minimum Pay: {job.wage.min} {job.wage.type}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="card-actions basis-1/12 items-center justify-center">
                    <JobSave jobId={job.id} mode={"list"} />
                  </div>
                </div>
              </Link>
            </li>
          );
        })
      : "Loading";
  }, [data, jobId]);

  return (
    <div className="w-full">
      <ul className="menu w-full">{jobs}</ul>
    </div>
  );
}
