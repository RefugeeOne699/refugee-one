import { createContext, useState } from "react";
import { Outlet, useParams } from "react-router-dom";

import JobList from "@/components/job/JobList";
import { ROLES } from "@/constants";
import { useAuth } from "@/models";

export const TabContext = createContext("pending");

export default function Job() {
  const auth = useAuth();
  const { jobId } = useParams();
  const sideMenuMobile = jobId ? "hidden" : "basis-full";
  const contentMobile = jobId ? "basis-full" : "hidden";
  const [activeTab, setActiveTab] = useState("pending");

  return (
    <TabContext.Provider value={activeTab}>
      {auth.user ? (
        <div className="flex flex-col min-h-screen">
          {auth.user.role === ROLES.CLIENT ? (
            ""
          ) : (
            <div className="tabs tabs-boxed tabs-lifted flex flex-row justify-center">
              <a
                onClick={() => setActiveTab("pending")}
                className={`tab tab-lg ${activeTab === "pending" ? "tab-active" : ""}`}
              >
                {auth.user.role === ROLES.EMPLOYER ? "In-Progress" : "Pending"} Jobs
              </a>
              <a
                onClick={() => setActiveTab("approved")}
                className={`tab tab-lg ${activeTab === "approved" ? "tab-active" : ""}`}
              >
                Approved Jobs
              </a>
              <a
                onClick={() => setActiveTab("rejected")}
                className={`tab tab-lg ${activeTab === "rejected" ? "tab-active" : ""}`}
              >
                Action Required Jobs
              </a>
            </div>
          )}
          <div className="flex flex-row">
            <div
              className={`${sideMenuMobile} md:block md:basis-1/2 lg:basis-1/3 flex-none`}
            >
              <JobList />
            </div>
            <div
              className={`${contentMobile} md:block md:basis-1/2 lg:basis-2/3 flex-none bg-slate-200`}
            >
              <Outlet />
            </div>
          </div>
        </div>
      ) : (
        <p>Nothing</p>
      )}
    </TabContext.Provider>
  );
}
