import { useRequest } from "ahooks";
import { useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import { Link, NavLink, Outlet, useParams } from "react-router-dom";

import Spin from "@/components/Spin";
import { useJob } from "@/models";

const menu = [
  { url: "pending", name: "All Pending Jobs" },
  { url: "approved", name: "All Approved Jobs" },
  { url: "todo", name: "All Action Required Jobs" },
];

export default function JobsAdmin() {
  const { tabUrl } = useParams();
  const { listJobs } = useJob();
  const { jobId } = useParams();
  const { data, run, loading } = useRequest(async () => listJobs(), {
    manual: true,
    onError: () => {
      toast.error("Failed to fetch job list");
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
            to={`/admin/jobs/${tab.url}`}
            className={({ isActive }) => `tab ${isActive ? "tab-active" : null}`}
            key={tab.name}
          >
            <div className="flex flex-row">
              {/*  todo: do what figma designs */}
              {tab.name}
              {"---"}
              {/*  todo: update the count */}
              {loading ? (
                <Spin />
              ) : !data ? (
                0
              ) : tab.url === "pending" ? (
                data.filter((v) => v.status === "pending").length
              ) : tab.url === "approved" ? (
                data.filter((v) => v.status === "approved").length
              ) : tab.url === "todo" ? (
                data.filter((v) => v.status === "rejected").length
              ) : (
                data.length
              )}
            </div>
          </NavLink>
        ))}
      </div>
    );
  }, [tabUrl, data, loading]);

  const JobList = useMemo(() => {
    const filteredJob = data
      ? Object.values(data).filter((v) => v.status === tabUrl)
      : [];
    return filteredJob
      ? filteredJob.map((job) => {
          return (
            <li className="flex flex-row w-full mt-5 " key={job.id}>
              <div
                className={`card card-compact w-full rounded-xl border-slate-400 border-4 flex flex-row justify-between ${
                  job.id && job.id === jobId ? "active" : ""
                }`}
              >
                <Link to={job.id} className="card-body w-full flex-none">
                  <div className="card-title text-xl">{job.title}</div>
                  <div className="flex flex-row flex-none">
                    <div className="flex flex-row flex-wrap flex-auto">
                      <p className="truncate w-1/2">{job.company}</p>
                      <p className="truncate w-1/2">{`${job.location}`}</p>
                      <p className="truncate w-1/2">
                        {job.benefit.hasMedical
                          ? "Medical Benefits"
                          : "No Medical Benefits"}
                      </p>
                      <p className="truncate w-1/2">
                        Minimum Pay: {job.wage.min} {job.wage.type}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </li>
          );
        })
      : "loading";
  }, [data, loading, tabUrl, jobId]);

  const content = useMemo(() => {
    if (loading) {
      return <Spin className="h-8 w-8" />;
    }
    //todo: display and filter
    return (
      <div className="flex flex-row">
        <div className={`md:block md:basis-1/2 lg:basis-1/3 flex-none bg-yellow-100`}>
          <ul className="menu w-full">{JobList}</ul>
        </div>
        <div className={`md:block md:basis-1/2 lg:basis-2/3 flex-none bg-slate-200`}>
          <Outlet />
        </div>
      </div>
    );
  }, [data, loading, tabUrl, jobId]);
  return (
    <div className="flex flex-col">
      {tabs}
      {content}
    </div>
  );
}
