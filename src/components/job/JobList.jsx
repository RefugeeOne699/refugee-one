import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useRequest } from "ahooks";
import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import { ROLES } from "@/constants";
import { useAuth, useJob } from "@/models";

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
            <li className="flex flex-row justify-center w-full mt-5" key={job.id}>
              <Link
                to={job.id}
                className={`${
                  job.id && job.id == jobId ? "active" : ""
                }  w-4/5 rounded-xl border-slate-400 border-4`}
              >
                <div className="card card-compact w-full">
                  <div
                    className={`absolute right-0 translate-y-1/2 bottom-1/2 text-xl ${
                      auth.user.role === ROLES.CLIENT ? "" : "hidden"
                    }`}
                  >
                    <StarBorderIcon style={{ fontSize: "5vh" }} />
                  </div>
                  <div className="card-body">
                    <div className="card-title text-xl">{job.title}</div>
                    <div className="flex felx-row w-11/12">
                      <p className="w-1/2 truncate">{job.company.name}</p>
                      <p className="w-1/2 truncate">{`${job.location}`}</p>
                    </div>
                    <div className="flex felx-row w-11/12">
                      <p className="w-1/2 truncate">
                        {job.benefits.hasMedical
                          ? "Medical Benefits"
                          : "No Medical Benefits"}
                      </p>
                      <p className="w-1/2 truncate">
                        Minimum Pay: {job.wage.min} {job.wage.type}
                      </p>
                    </div>
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
