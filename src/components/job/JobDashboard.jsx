import { useRequest } from "ahooks";
import { where } from "firebase/firestore";
import { createContext, useContext, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import { NavLink, useParams } from "react-router-dom";

import JobRoot from "@/components/job/JobRoot";
import Spin from "@/components/Spin";
import { JOB_STATUS, ROLES } from "@/constants";
import { useAuth, useJob } from "@/models";

const menu = [
  { url: "pending", name: "All Pending Jobs" },
  { url: "approved", name: "All Approved Jobs" },
  { url: "todo", name: "All Action Required Jobs" },
];

const constraints = {
  pending: JOB_STATUS.PENDING,
  approved: JOB_STATUS.APPROVED,
  todo: JOB_STATUS.REJECTED,
};

const DashboardContext = createContext(undefined);
/**
 *  if the context value is undefined, it means we are not at the context of an admin/employer dashboard
 */
export const useDashboard = () => useContext(DashboardContext);

// This component is for employer and admin job management dashboard
export default function JobDashboard({ role }) {
  const { tabUrl } = useParams();
  const { listJobs, countJobs, listEmployerJobs } = useJob();
  const auth = useAuth();
  const {
    data,
    run,
    loading,
    refresh: jobsRefresh,
  } = useRequest(
    async (tabUrl) =>
      auth.user.role === ROLES.EMPLOYER
        ? listEmployerJobs(auth.user.uid, constraints[tabUrl])
        : listJobs(
            auth.user.role,
            where("status", "==", constraints[tabUrl] || JOB_STATUS.PENDING)
          ),
    {
      manual: true,
      onError: () => {
        toast.error("Failed to fetch job list");
      },
    }
  );

  const {
    data: jobCounts,
    run: runCount,
    loading: counting,
    refresh: countRefresh,
  } = useRequest(
    async () => {
      let data = {};
      for (let url in constraints) {
        data[url] = await countJobs(where("status", "==", constraints[url]));
      }
      return Promise.resolve(data);
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    (async () => {
      await run(tabUrl);
      await runCount();
    })();
  }, [tabUrl]);

  const tabs = useMemo(() => {
    return (
      <div className="tabs tabs-boxed">
        {menu.map((tab) => (
          <NavLink
            to={`/${role}/jobs/${tab.url}`}
            className={({ isActive }) => `tab ${isActive ? "tab-active" : null}`}
            key={tab.name}
          >
            <div className="flex flex-row">
              {/*  todo: do what figma designs */}
              {tab.name}
              {"---"}
              {loading || counting ? <Spin /> : jobCounts ? jobCounts[tab.url] : 0}
            </div>
          </NavLink>
        ))}
      </div>
    );
  }, [jobCounts, loading, counting, tabUrl]);
  const content = useMemo(() => {
    if (loading) {
      return <Spin className="h-8 w-8" />;
    }
    return <JobRoot />;
  }, [data, jobCounts, loading, counting, tabUrl]);

  const value = useMemo(
    () => ({
      // jobs: all jobs that should be in the active tab (i.e all jobs will be pending jobs if we are in the pending tab)
      jobs: data,
      jobsRefresh,
      countRefresh,
      jobsLoading: loading,
    }),
    [data, loading]
  );

  return (
    <DashboardContext.Provider value={value}>
      <div className="flex flex-col max-h-screen h-full">
        {tabs}
        {content}
      </div>
    </DashboardContext.Provider>
  );
}
