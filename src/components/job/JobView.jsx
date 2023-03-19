import { useRequest } from "ahooks";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { numberToDaysOfWeek } from "@/utils";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import WorkIcon from '@mui/icons-material/Work';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import TranslateIcon from '@mui/icons-material/Translate';
import LanguageIcon from '@mui/icons-material/Language';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DescriptionIcon from '@mui/icons-material/Description';
import { useJob } from "@/models";
import { Link } from "react-router-dom";

export default function JobView() {
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
          <button className="btn btn-primary absolute ml-10 mt-10 md:hidden" onClick={()=>setOverlay(false)}>
            Back
          </button>
        <div className="card-body items-center">
            <p className="card-title text-2xl">{data.title}</p>
            <p className="text-bold text-1xl">{data.company.name}</p>
            <p className="text-bold text-1xl">Posted: {(`${new Date(data.datePost.seconds*1000)}`).split(" ").slice(0,4).join(" ")}</p>
          <div className="flex w-full flex-col lg:flex-row">
            <div className="flex flex-row mt-5 w-full lg:w-1/2 ">
              <CalendarMonthIcon style={{ fontSize: "6.5vh" }}/>
              <div className="ml-3">
                <p className="font-bold">Starting Date:</p>
                {(`${new Date(data.datePost.seconds*1000)}`).split(" ").slice(0,4).join(" ")}
              </div>
            </div>
            <div className="flex flex-row mt-5 w-full lg:w-1/2">
              <WorkIcon style={{ fontSize: "6.5vh" }}/>
              <div className="ml-3">
                <p className="font-bold">Job Type:</p>
                {data.hasMedicalBenefit ? "Full-Time": "Part-Time"}
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col lg:flex-row">
            <div className="flex flex-row mt-5 w-full lg:w-1/2 ">
              <AttachMoneyIcon style={{ fontSize: "6.5vh" }}/>
              <div className="ml-3">
                <p className="font-bold">Salary Range:</p>
                <p>{`${data.wageHourlyMin} - ${data.wageHourlyMax} dollars/hr` }</p>
              </div>
            </div>
            <div className="flex flex-row mt-5 w-full lg:w-1/2">
              <LocalHospitalIcon style={{ fontSize: "6.5vh" }}/>
              <div className="ml-3">
                <p className="font-bold">Medical Benefits:</p>
                <p>{data.hasMedicalBenefit ? "Included": "None"}</p>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col lg:flex-row">
            <div className="flex flex-row mt-5 w-full lg:w-1/2">
              <LanguageIcon style={{ fontSize: "6.5vh" }}/>
              <div className="ml-3">
                <p className="font-bold">English Level:</p>
                <p>{data.langEnglishLevel}</p>
              </div>
            </div>
            <div className="flex flex-row mt-5 w-full lg:w-1/2 ">
              <TranslateIcon style={{ fontSize: "6.5vh" }}/>
              <div className="ml-3">
                <p className="font-bold" >Language Notes:</p>
                <p>{data.langNote}</p>
              </div>
            </div>
          </div>
          <div className="flex w-full mt-5 flex-row">
            <LocationOnIcon style={{ fontSize: "6.5vh" }}/>
            <div className="ml-3">
              <p className="font-bold">Job Location:</p>
              <p>{data.location}</p>
            </div>
          </div>
          <div className="flex w-full mt-5 flex-row">
            <AccessTimeIcon style={{ fontSize: "6.5vh" }}/>
            <div className="ml-3">
              <p className="font-bold">Job Timing:</p>
              <p>Days: {numberToDaysOfWeek(data.shift.daysOfWeek).join(", ")}</p>
              <p>Hours: {`${data.shift.timeStart} - ${data.shift.timeEnd}`}</p>
            </div>
          </div>
          <div className="flex flex-row w-full mt-5">
            <DescriptionIcon style={{ fontSize: "6.5vh" }}/>
            <div className="ml-3">
              <p className="font-bold">Job Description:</p>
              <p>{data.description}</p>
            </div>
          </div>
          <div className="w-full flex flex-row justify-center mt-5">
            <button className="btn btn-primary mr-10">
              Back
            </button>
            <button className="btn btn-primary">
              Saved
            </button>
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
