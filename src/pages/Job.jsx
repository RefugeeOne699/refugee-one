import { Outlet, useParams } from "react-router-dom";

import JobList from "@/components/job/JobList";

export default function Job() {
  const { jobId } = useParams();
  const sideMenuMobile = jobId ? "hidden" : "w-full";
  const contentMobile = jobId ? "w-full" : "hidden";
  return (
    <div className="flex flex-row min-h-screen h-fit w-screen">
      <div
        className={`${sideMenuMobile} md:block md:basis-1/2 lg:basis-5/12 flex-none h-full`}
      >
        <JobList />
      </div>
      <div
        className={`${contentMobile} md:block md:basis-1/2 lg:basis-7/12 flex-none bg-slate-200 h-full`}
      >
        <Outlet />
      </div>
    </div>
  );
}
