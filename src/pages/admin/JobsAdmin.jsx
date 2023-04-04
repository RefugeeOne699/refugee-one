import { useRequest } from "ahooks";
import { useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import { NavLink, useParams } from "react-router-dom";

import Spin from "@/components/Spin";
import { useAdmin, useJob } from "@/models";

// Todo: Determine if user is coming from job management link or user management link
// Below is temp solution
const isJob = true;

const menu = isJob
  ? [
      { url: "pending", name: "All Pending Jobs" },
      { url: "approved", name: "All Approved Jobs" },
      { url: "todo", name: "All Action Required Jobs" },
    ]
  : [
      { url: "employers", name: "Employers" },
      { url: "refugees", name: "Refugees" },
      { url: "admin", name: "Administrators" },
    ];

export default function JobsAdmin() {
  const { tabUrl } = useParams();
  const { listJobs } = useJob();
  const { listUsers } = useAdmin();
  const fetchFunction = isJob ? listJobs : listUsers;
  const { data, run, loading } = useRequest(async () => fetchFunction(), {
    manual: true,
    onError: () => {
      toast.error(`Failed to fetch ${isJob ? "jobs" : "users"} list`);
    },
  });
  useEffect(() => {
    (async () => {
      await run();
    })();
  }, []);
  const tabs = useMemo(() => {
    return (
      <div className="tabs tabs-boxed">
        {menu.map((tab) => (
          <NavLink
            to={`/admin/${isJob ? "jobs" : "users"}/${tab.url}`}
            className={({ isActive }) => `tab ${isActive ? "tab-active" : null}`}
            key={tab.name}
          >
            <div className="flex flex-row">
              {/*  todo: do what figma designs */}
              {tab.name}
              {"---"}
              {/*  todo: update the count */}
              {loading ? <Spin /> : data ? data.length : 0}
            </div>
          </NavLink>
        ))}
      </div>
    );
  }, [tabUrl, data, loading]);
  const content = useMemo(() => {
    if (loading) {
      return <Spin className="h-8 w-8" />;
    }
    //todo: display Job.jsx or User.jsx and filter
    return data ? JSON.stringify(data) : "no data";
  }, [data, loading, tabUrl]);
  return (
    <div className="flex flex-col">
      {tabs}
      {content}
    </div>
  );
}
