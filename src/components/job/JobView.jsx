import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DescriptionIcon from "@mui/icons-material/Description";
import LanguageIcon from "@mui/icons-material/Language";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import TranslateIcon from "@mui/icons-material/Translate";
import WorkIcon from "@mui/icons-material/Work";
import { useRequest } from "ahooks";
import { useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";

import { useAuth, useJob } from "@/models";
import { calculateDistance } from "@/utils";

import Center from "../Center";
import ErrorInfo from "../Error";
import Spin from "../Spin";
import JobActions from "./jobActions/JobActions";

export default function JobView() {
  const auth = useAuth();
  const { jobId } = useParams();
  const { getJob } = useJob();
  if (!jobId) {
    return <Center />;
  }
  const { run, data, loading, error } = useRequest(
    async () => {
      // return getJob(jobId);
      return getJob(jobId).then((data) => {
        if (auth.user.coordinate && data.coordinate) {
          let userCoordinate = auth.user.coordinate;
          let jobCoordinate = data.coordinate;
          const distance = calculateDistance(
            userCoordinate.latitude,
            userCoordinate.longitude,
            jobCoordinate.latitude,
            jobCoordinate.longitude
          );
          data.distance = distance;
        } else {
          data.distance = null;
        }
        return data;
      });
    },
    {
      manual: true,
      onError: () => {
        toast.error("Failed to get the job information");
      },
    }
  );

  useEffect(() => {
    (async () => {
      await run();
    })();
  }, [jobId]);

  const content = useMemo(() => {
    if (loading) {
      return (
        <Center>
          <Spin className="h-8 w-8" />
        </Center>
      );
    }
    if (error) {
      return <ErrorInfo />;
    }
    return data ? (
      <div className="h-full w-full flex flex-col justify-between">
        <div className="flex flex-col card">
          <div className="card-body items-center">
            <p className="card-title text-2xl">{data.title}</p>
            <p className="text-bold text-1xl">{data.company}</p>
            <p className="text-bold text-1xl">
              Posted:{" "}
              {`${new Date(data.datePost.seconds * 1000)}`
                .split(" ")
                .slice(0, 4)
                .join(" ")}
            </p>
            <div className="flex w-full flex-col lg:flex-row">
              <div className="flex flex-row mt-5 w-full lg:w-1/2 ">
                <div className="text-5xl">
                  <CalendarMonthIcon fontSize="inherit" />
                </div>
                <div className="ml-3">
                  <p className="font-bold">Starting Date:</p>
                  {`${new Date(data.dateJobStart.seconds * 1000)}`
                    .split(" ")
                    .slice(0, 4)
                    .join(" ")}
                </div>
              </div>
              <div className="flex flex-row mt-5 w-full lg:w-1/2">
                <div className="text-5xl">
                  <WorkIcon fontSize="inherit" />
                </div>
                <div className="ml-3">
                  <p className="font-bold">Job Type:</p>
                  Database TBD
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col lg:flex-row">
              <div className="flex flex-row mt-5 w-full lg:w-1/2 ">
                <div className="text-5xl">
                  <AttachMoneyIcon fontSize="inherit" />
                </div>
                <div className="ml-3">
                  <p className="font-bold">Salary Range:</p>
                  <p>{`${data.wage.min} - ${data.wage.max} ${data.wage.type}`}</p>
                </div>
              </div>
              <div className="flex flex-row mt-5 w-full lg:w-1/2">
                <div className="text-5xl">
                  <LanguageIcon fontSize="inherit" />
                </div>
                <div className="ml-3">
                  <p className="font-bold">English Level:</p>
                  <p>{data.langEnglishLevel}</p>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col lg:flex-row">
              <div className="flex flex-row mt-5 w-full lg:w-1/2">
                <div className="text-5xl">
                  <LocalHospitalIcon fontSize="inherit" />
                </div>
                <div className="ml-3">
                  <p className="font-bold">Benefits:</p>
                  <p>Medical: {data.benefit.hasMedical ? "Included" : "None"}</p>
                  <p>Others: {data.benefit.hasOthers ? data.benefit.others : "None"}</p>
                </div>
              </div>
              <div className="flex flex-row mt-5 w-full lg:w-1/2 ">
                <div className="text-5xl">
                  <TranslateIcon fontSize="inherit" />
                </div>
                <div className="ml-3">
                  <p className="font-bold">Language Notes:</p>
                  <p>{data.langNote}</p>
                </div>
              </div>
            </div>
            <div className="flex w-full mt-5 flex-row">
              <div className="text-5xl">
                <LocationOnIcon fontSize="inherit" />
              </div>
              <div className="ml-3">
                <p className="font-bold">Job Location:</p>
                <p>{data.location}</p>
                <a
                  className="text-blue-400"
                  href={
                    "https://www.google.com/maps/search/?api=1&query=" + data.location
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View location on Google Map
                </a>
                <p>
                  {data.distance
                    ? data.distance.toFixed(1) + " miles from you"
                    : "Distance not applied"}
                </p>
              </div>
            </div>
            <div className="flex w-full mt-5 flex-row">
              <div className="text-5xl">
                <AccessTimeIcon fontSize="inherit" />
              </div>
              <div className="ml-3">
                <p className="font-bold">Job Timing:</p>
                <p>{data.shift}</p>
              </div>
            </div>
            <div className="flex flex-row w-full mt-5">
              <div className="text-5xl">
                <DescriptionIcon fontSize="inherit" />
              </div>
              <div className="ml-3">
                <p className="font-bold">Job Description:</p>
                <p>{data.description}</p>
              </div>
            </div>
          </div>
        </div>
        <JobActions job={data} jobId={jobId} />
      </div>
    ) : (
      <p>Nothing</p>
    );
  }, [data, loading, error]);

  return <div className="w-full h-full">{content}</div>;
}
