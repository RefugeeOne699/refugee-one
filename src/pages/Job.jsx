import { Outlet, useParams } from "react-router-dom";

import JobList from "@/components/job/jobList/JobList";

export default function Job() {
  const { jobId } = useParams();
  const sideMenuMobile = jobId ? "hidden" : "basis-full";
  const contentMobile = jobId ? "basis-full" : "hidden";
  return (
    <div className="flex flex-row">
      <div
        className={`${sideMenuMobile}  md:block md:basis-1/2 lg:basis-1/3 flex-none min-w-0`}
      >
        <JobList />
      </div>
      <div
        className={`${contentMobile} md:block md:basis-1/2 lg:basis-2/3 flex-none bg-slate-200`}
      >
        <Outlet />
      </div>
    </div>
  );
}
