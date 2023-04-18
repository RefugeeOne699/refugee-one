import { useRequest } from "ahooks";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { Outlet, useParams } from "react-router-dom";

import JobList from "@/components/job/jobList/JobList";
import { useAuth, useJob } from "@/models";
import { calculateDistance } from "@/utils";

import { useDashboard } from "./JobDashboard";

/**
 * if Job has a `data` in the props, it will not fetch the job list, instead it will just use the `data`
 */
export default function SavedJobRoot() {
  const auth = useAuth();
  const { listSavedJobs } = useJob();
  const { run, data: pulledJobs } = useRequest(
    async () => {
      return listSavedJobs(auth.user.uid).then((data) => {
        for (let i = 0; i < data.length; i++) {
          if (auth.user.coordinate && data[i].coordinate) {
            let userCoordinate = auth.user.coordinate;
            let jobCoordinate = data[i].coordinate;
            const distance = calculateDistance(
              userCoordinate.latitude,
              userCoordinate.longitude,
              jobCoordinate.latitude,
              jobCoordinate.longitude
            );
            data[i].distance = distance.toString();
          } else {
            data[i].distance = null;
          }
        }
        return data;
      });
    },
    {
      manual: true,
      onError: (error) => {
        toast.error(`Failed to get saved job list: ${error}`);
      },
    }
  );
  const dashboard = useDashboard();
  useEffect(() => {
    if (auth.user && !dashboard) {
      (async () => run())();
    }
  }, [auth.user, dashboard]);

  const jobs = dashboard ? dashboard.jobs : pulledJobs;

  const { jobId } = useParams();
  const sideMenuMobile = jobId ? "hidden" : "w-full";
  const contentMobile = jobId ? "w-full" : "hidden";
  return (
    <div className="flex flex-row h-full max-h-screen">
      <div className={`${sideMenuMobile} md:block md:w-1/2 lg:w-1/3 flex-none h-full`}>
        <JobList data={jobs} />
      </div>
      <div
        className={`${contentMobile} md:block md:w-1/2 lg:w-2/3 flex-none bg-base-200 md:max-h-full max-md:h-fit`}
      >
        <Outlet />
      </div>
    </div>
  );
}
