import { useRequest } from "ahooks";
import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import { useAuth, useJob } from "@/models";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { OverlayContext } from "@/pages/Job";
import { useContext } from "react";

export default function JobList() {

  const {setOverlay} = useContext(OverlayContext)
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
        console.log(job)
          return (
            <li className="flex flex-row justify-center w-full mt-5" key={job.id}>
              <Link  to={job.id} className={`${job.id && job.id == jobId ? "active" : ""}  w-4/5 rounded-xl border-slate-400 border-4`} onClick={()=>setOverlay(true)}>
                <div className="card card-compact w-full">
                  <div className={`absolute right-0 translate-y-1/2 bottom-1/2 text-xl ${auth.user.role === "admin"?"":"hidden"}`}>
                    <StarBorderIcon style={{ fontSize: "6.5vh" }}/>
                  </div>
                  <div className="card-body">
                  <div className="card-title text-xl">{job.title}</div>
                    <div className="flex felx-row w-11/12">
                      <p className="w-1/2 flex justify-start">{job.company.name}</p>
                      <p className="w-1/2 flex justify-start" >{`${job.location.slice(0,18)}...`}</p>
                    </div>
                    <div className="flex felx-row w-11/12">
                      <p className="w-1/2 flex justify-start">{job.hasMedicalBenefit ? "Offers Benefits" : "No Benefits"}</p>
                      <p className="w-1/2  flex justify-start">Min $/hr: {job.wageHourlyMin}</p>
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
      <div className="w-full flex flex-row justify-center">
        <div className="w-4/5 flex flex-row justify-between	">
          <input aria-label='Search' type="text" placeholder={"Search job or company name"} className="input input-bordered w-4/5"/>
          <div className={`h-full aspect-square`}>
            <FilterAltIcon style={{ fontSize: "6.5vh" }}/>
          </div>
        </div>
      </div>
      <ul className="menu w-full">{jobs}</ul>
    </div>
  );
}
