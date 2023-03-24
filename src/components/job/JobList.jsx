import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CloseIcon from "@mui/icons-material/Close";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import LanguageIcon from "@mui/icons-material/Language";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import SearchIcon from "@mui/icons-material/Search";
import WorkIcon from "@mui/icons-material/Work";
import { useRequest } from "ahooks";
import { orderBy, query, where } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";

import {
  BENEFIT,
  ENGLISH_LEVEL,
  JOB_POSTED_FILTER,
  JOB_TYPE,
  WAGE_FILTER,
} from "@/constants";
import { useAuth, useJob } from "@/models";

import JobSave from "./JobSave";

export default function JobList() {
  const { listJobs } = useJob();
  const { jobId } = useParams();
  const { run, data } = useRequest(async () => listJobs(), {
    manual: true,
  });
  const auth = useAuth();

  const [showFilter, setShowFilter] = useState(false);
  const { register, reset, handleSubmit } = useForm({
    defaultValues: {
      jobPosted: "Anytime",
      jobType: [],
      wage: "0",
      english: [],
      benefit: [],
    },
    shouldUnregister: false,
  });
  // test only
  const onSubmit = async (data) => {
    //stringify json
    // base64??? -> string
    console.log(data);
    setShowFilter(!showFilter);
    data.english;
    //test for the english level
    data.english;
    const a = where("langEnglishLevel", "==", "advanced");
    const myJobs = await listJobs(a);
    console.log(myJobs);

    //<Link to="/jobs/1234?english=advanced&wageGE=20"
  };

  useEffect(() => {
    if (auth.user) {
      (async () => {
        await run();
      })();
    }
  }, []);

  const jobs = useMemo(() => {
    return data
      ? data.map((job) => {
          return (
            <li className="flex flex-row w-full mt-5 " key={job.id}>
              <div
                className={`card card-compact w-full rounded-xl border-slate-400 border-4 ${
                  job.id && job.id == jobId ? "active" : ""
                }`}
              >
                <Link to={job.id} className="w-full flex flex-row justify-between">
                  <div className="card-body basis-9/12 flex-none">
                    <div className="card-title text-xl">{job.title}</div>
                    <div className="flex flex-row flex-none">
                      <div className="flex flex-row flex-wrap flex-auto">
                        <p className="truncate w-1/2">{job.company.name}</p>
                        <p className="truncate w-1/2">{`${job.location}`}</p>
                        <p className="truncate w-1/2">
                          {job.benefits.hasMedical
                            ? "Medical Benefits"
                            : "No Medical Benefits"}
                        </p>
                        <p className="truncate w-1/2">
                          Minimum Pay: {job.wage.min} {job.wage.type}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="card-actions basis-1/12 items-center justify-center">
                    <JobSave jobId={job.id} mode={"list"} />
                  </div>
                </Link>
              </div>
            </li>
          );
        })
      : "Loading";
  }, [data, jobId]);

  return (
    <div className="relative flex flex-col h-screen  bg-yellow-100">
      {/* Search bar and filter icon */}
      <div className="flex flex-row items-center justify-between h-16 p-3 bg-blue-100">
        <div className="relative text-gray-600">
          {/* todo: add functionality to search bar */}
          <input
            className="w-64 border-2 border-gray-300 bg-white h-10 px-5 pr-10 rounded-lg text-sm focus:outline-none"
            type="search"
            name="search"
            placeholder="Search"
          />
          <button className="absolute right-0 top-1.5  mr-4">
            <SearchIcon />
          </button>
        </div>
        <FilterAltIcon fontSize="large" onClick={() => setShowFilter(!showFilter)} />
      </div>

      {/* Filter Panel UI */}
      {showFilter ? (
        <div className="absolute z-10 top-0 left-0 w-full h-full bg-white overflow-scroll">
          {/* Top Bar */}
          <div className="sticky top-0 left-0 flex flex-row justify-between items-center w-full h-16 p-3 bg-slate-200">
            <button
              className="btn btn-sm"
              onClick={() => {
                reset();
              }}
            >
              Reset
            </button>
            <span className="text-2xl font-bold text-slate-900">Filters</span>
            <CloseIcon
              fontSize="large"
              style={{ color: "black" }}
              onClick={() => setShowFilter(!showFilter)}
            />
          </div>

          {/* Filter Content */}
          <div className="flex flex-col h-full px-3">
            <form
              className="flex flex-col divide-y gap-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* Job Posted Category */}
              <div className="form-control pt-2">
                <div className="flex flex-row items-center">
                  <AccessTimeIcon fontSize="large" className="mr-1" />
                  <label className="label text-xl text-black" htmlFor="jobPosted">
                    Job Posted
                  </label>
                </div>

                {JOB_POSTED_FILTER.map((item, index) => {
                  return (
                    <label className="label cursor-pointer" key={index}>
                      <span className="label-text">{item}</span>
                      <input
                        type="radio"
                        name="radio-jobPosted"
                        className="radio radio-primary"
                        value={item}
                        {...register("jobPosted")}
                      />
                    </label>
                  );
                })}
              </div>

              {/* Job Type Category */}
              <div className="form-control pt-2">
                <div className="flex flex-row items-center">
                  <WorkIcon fontSize="large" className="mr-1" />
                  <label className="label text-xl text-black" htmlFor="jobType">
                    Job Type
                  </label>
                </div>

                {JOB_TYPE.map((item, index) => {
                  return (
                    <label className="label cursor-pointer" key={index}>
                      <span className="label-text">{item}</span>
                      <input
                        type="checkbox"
                        name="checkbox-jobType"
                        className="checkbox checkbox-primary"
                        value={item}
                        {...register("jobType")}
                      />
                    </label>
                  );
                })}
              </div>

              {/* Wage Category */}
              <div className="form-control pt-2">
                <div className="flex flex-row items-center">
                  <AttachMoneyIcon fontSize="large" className="mr-1" />
                  <label className="label text-xl text-black" htmlFor="wage">
                    Wage
                  </label>
                </div>

                {WAGE_FILTER.map((minWage, index) => {
                  return (
                    <label className="label cursor-pointer" key={index}>
                      <span className="label-text">
                        {index === 0 ? "Any Wage" : `\$ ${minWage}+ / hour`}
                      </span>
                      <input
                        type="radio"
                        name="radio-wage"
                        className="radio radio-primary"
                        value={minWage}
                        {...register("wage")}
                      />
                    </label>
                  );
                })}
              </div>

              {/* English Level Category */}
              <div className="form-control pt-2">
                <div className="flex flex-row items-center">
                  <LanguageIcon fontSize="large" className="mr-1" />
                  <label className="label text-xl text-black" htmlFor="english">
                    English Level
                  </label>
                </div>

                {ENGLISH_LEVEL.map((englishLevel, index) => {
                  return (
                    <label className="label cursor-pointer" key={index}>
                      <span className="label-text">{englishLevel}</span>
                      <input
                        type="checkbox"
                        name="checkbox-english"
                        className="checkbox checkbox-primary"
                        value={englishLevel}
                        {...register("english")}
                      />
                    </label>
                  );
                })}
              </div>
              
              {/* Benefit Category */}
              <div className="form-control pt-2">
                <div className="flex flex-row items-center">
                  <LocalHospitalIcon fontSize="large" className="mr-1" />
                  <label className="label text-xl text-black" htmlFor="benefit">
                    Benefit
                  </label>
                </div>

                {BENEFIT.map((benefitType, index) => {
                  return (
                    <label className="label cursor-pointer" key={index}>
                      <span className="label-text">{benefitType}</span>
                      <input
                        type="checkbox"
                        name="checkbox-benefit"
                        className="checkbox checkbox-primary"
                        value={benefitType}
                        {...register("benefit")}
                      />
                    </label>
                  );
                })}
              </div>

              {/* bottom submit button */}
              <div className="form-control pt-5 pb-5">
                <button className="btn w-44" type="submit">
                  Show Results
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Job List UI */}
      <ul className="menu w-full">{jobs}</ul>
    </div>
  );
}
