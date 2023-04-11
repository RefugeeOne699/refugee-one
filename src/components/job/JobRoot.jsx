import { useRequest } from "ahooks";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { Outlet, useParams } from "react-router-dom";

import JobList from "@/components/job/jobList/JobList";
import { useAuth, useJob } from "@/models";
import { calculateDistance } from "@/utils";

/**
 * if Job has a `data` in the props, it will not fetch the job list, instead it will just use the `data`
 */
export default function JobRoot({ data }) {
  const auth = useAuth();
  const { listJobs } = useJob();
  const { run, data: pulledJobs } = useRequest(
    async () => {
      return listJobs().then((data) => {
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
      onError: () => {
        toast.error("Failed to get job list");
      },
    }
  );
  useEffect(() => {
    if (auth.user && !data) {
      (async () => run())();
    }
  }, [auth.user, data]);

  const jobs = data || pulledJobs;

  const { jobId } = useParams();
  const sideMenuMobile = jobId ? "hidden" : "w-full";
  const contentMobile = jobId ? "w-full" : "hidden";
  return (
    <div className="flex flex-row h-full max-h-screen">
      <div className={`${sideMenuMobile} md:block md:w-1/2 lg:w-1/3 flex-none h-full`}>
        <JobList data={jobs} />
      </div>
      <div
        className={`${contentMobile} md:block md:w-1/2 lg:w-2/3 flex-none bg-base-200 max-h-full`}
      >
        <Outlet />
      </div>
    </div>
  );
}
