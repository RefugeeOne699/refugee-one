import { useRequest } from "ahooks";
import { useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import { NavLink, useParams } from "react-router-dom";

import Center from "@/components/Center";
import Spin from "@/components/Spin";
import UserView from "@/components/user/UserView";
import { ROLES } from "@/constants";
import { useAdmin } from "@/models";

const menu = [
  { url: ROLES.CLIENT, name: "Clients" },
  { url: ROLES.EMPLOYER, name: "Employers" },
  { url: ROLES.ADMIN, name: "Administrators" },
];

export default function JobsAdmin() {
  const { tabUrl } = useParams();
  const { listUsers } = useAdmin();
  const { data, run, loading, refresh } = useRequest(async () => listUsers(), {
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
              {loading ? (
                <Spin />
              ) : data ? (
                data.filter((users) => users.role === tab.url).length
              ) : (
                0
              )}
            </div>
          </NavLink>
        ))}
      </div>
    );
  }, [tabUrl, data, loading]);
  const content = useMemo(() => {
    if (loading) {
      return (
        <Center>
          <Spin className="h-8 w-8" />
        </Center>
      );
    }
    return (
      <div className="w-full">
        {data ? (
          data
            /* for sorting: https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value */
            .filter((user) => user.role === tabUrl)
            .sort((a, b) => -(a.status > b.status ? 1 : a.status === b.status ? 0 : -1))
            .map((user) => {
              return <UserView key={user.id} user={user} refresh={refresh} />;
            })
        ) : (
          <p>No users to show</p>
        )}
      </div>
    );
  }, [data, loading, tabUrl]);
  return (
    <div className="flex flex-col h-full">
      {tabs}
      {content}
    </div>
  );
}
