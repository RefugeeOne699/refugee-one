import { useState } from "react";
import { Outlet, useParams } from "react-router-dom";

import JobList from "@/components/job/JobList";
import { ROLES } from "@/constants";
import { useAuth } from "@/models";

export default function Job() {
  const auth = useAuth();
  const { jobId } = useParams();
  const sideMenuMobile = jobId ? "hidden" : "basis-full";
  const contentMobile = jobId ? "basis-full" : "hidden";
  const [activeTab, setActiveTab] = useState(0);

  const changeTab = (tab) => {
    if (tab !== activeTab) {
      /* Additional filtering logic here...*/
      setActiveTab(tab);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {auth.user.role === ROLES.CLIENT ? (
        ""
      ) : (
        <div className="tabs tabs-boxed tabs-lifted flex flex-row justify-center">
          <a
            onClick={() => changeTab(0)}
            className={`tab tab-lg ${activeTab === 0 ? "tab-active" : ""}`}
          >
            {auth.user.role === ROLES.EMPLOYER ? "In-Progress" : "Pending"} Jobs
          </a>
          <a
            onClick={() => changeTab(1)}
            className={`tab tab-lg ${activeTab === 1 ? "tab-active" : ""}`}
          >
            Approved Jobs
          </a>
          <a
            onClick={() => changeTab(2)}
            className={`tab tab-lg ${activeTab === 2 ? "tab-active" : ""}`}
          >
            Rejected Jobs
          </a>
        </div>
      )}
      <div className="flex flex-row">
        <div className={`${sideMenuMobile} md:block md:basis-1/2 lg:basis-1/3 flex-none`}>
          <JobList />
        </div>
        <div
          className={`${contentMobile} md:block md:basis-1/2 lg:basis-2/3 flex-none bg-slate-200`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
