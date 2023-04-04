import { useRequest } from "ahooks";
import { useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import { NavLink, useParams } from "react-router-dom";

import Spin from "@/components/Spin";
import { useAdmin } from "@/models";

const menu = [
  { url: "employers", name: "Employers" },
  { url: "refugees", name: "Refugees" },
  { url: "admin", name: "Administrators" },
];

export default function UsersAdmin() {
  const { tabUrl } = useParams();
  const { listUsers } = useAdmin();
  // Todo: employ parameters based on which tab is chosen
  const param = {}
  const { data, run, loading } = useRequest(async () => listUsers(), {
    manual: true,
    onError: () => {
      toast.error("Failed to fetch user list");
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
            to={`/admin/users/${tab.url}`}
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
    //todo: display and filter
    return data ? JSON.stringify(data) : "no data";
  }, [data, loading, tabUrl]);
  return (
    <div className="flex flex-col">
      {tabs}
      {content}
    </div>
  );
}
