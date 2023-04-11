import { useRequest } from "ahooks";
import { where } from "firebase/firestore";
import { useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import { NavLink, useParams } from "react-router-dom";

import JobRoot from "@/components/job/JobRoot";
import Spin from "@/components/Spin";
import { JOB_STATUS } from "@/constants";
import { useJob } from "@/models";

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

// This component is for employer and admin job management dashboard
export default function JobDashboard() {
  const { tabUrl } = useParams();
  const { listJobs, countJobs } = useJob();

  const { data, run, loading } = useRequest(
    async (tabUrl) =>
      listJobs(where("status", "==", constraints[tabUrl] || JOB_STATUS.PENDING)),
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
            to={`/admin/jobs/${tab.url}`}
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
    //todo: display and filter
    return <JobRoot data={data} />;
  }, [data, jobCounts, loading, counting, tabUrl]);

  return (
    <div className="flex flex-col max-h-screen h-full">
      {tabs}
      {content}
    </div>
  );
}
