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
import { Link, useParams } from "react-router-dom";

import { useJob } from "@/models";

import JobSave from "./JobSave";

export default function JobView() {
  const iconSize = "6.5vh";
  const { jobId } = useParams();
  const { getJob } = useJob();
  if (!jobId) {
    // todo: add an error page
    return <p className="text-bold text-3xl">404 not found.</p>;
  }
  const { run, data, loading } = useRequest(async () => getJob(jobId), {
    manual: true,
    onError: () => {
      alert("unable to get the job");
    },
  });

  useEffect(() => {
    (async () => {
      await run();
    })();
  }, [jobId]);

  const content = useMemo(() => {
    if (loading) {
      return <p>loading</p>;
    }
    return data ? (
      <div className="flex flex-col card">
        <div className="card-body items-center">
          <p className="card-title text-2xl">{data.title}</p>
          <p className="text-bold text-1xl">{data.company.name}</p>
          <p className="text-bold text-1xl">
            Posted:{" "}
            {`${new Date(data.datePost.seconds * 1000)}`.split(" ").slice(0, 4).join(" ")}
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
            </div>
          </div>
          <div className="flex w-full mt-5 flex-row">
          <div className="text-5xl">
              <AccessTimeIcon fontSize="inherit" />
            </div>
            <div className="ml-3">
              <p className="font-bold">Job Timing:</p>
              <p>{data.shift.detail}</p>
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
          <div className="w-full flex flex-row justify-center mt-5">
            <Link to={".."}>
              <button className="btn btn-primary mr-10 md:hidden">Back</button>
            </Link>
            <JobSave jobId={jobId} />
          </div>
        </div>
      </div>
    ) : (
      <p>Nothing</p>
    );
  }, [data, loading]);

  // todo: job details
  return content;
}
