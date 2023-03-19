import { Outlet, useParams } from "react-router-dom";

import JobList from "@/components/job/JobList";

export default function Job() {
  const { jobId } = useParams();
  const sideMenuMobile = jobId ? "hidden" : "basis-full";
  const contentMobile = jobId ? "basis-full" : "hidden";
  return (
    <div className="flex flex-row h-screen">
      <div className={`${sideMenuMobile} md:block md:basis-1/2 lg:basis-5/12 flex-none h-full`}>
        <JobList />
      </div>
      <div className={`${contentMobile} md:block md:basis-1/2 lg:basis-7/12 flex-none bg-slate-200 h-full`}>
        <Outlet />
      </div>
    </div>
  );
}
