import AbcIcon from "@mui/icons-material/Abc";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CloseIcon from "@mui/icons-material/Close";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import LanguageIcon from "@mui/icons-material/Language";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import { useRequest } from "ahooks";
import _ from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Link, useParams } from "react-router-dom";

import { BENEFIT_TYPE, ENGLISH_LEVEL, SHIFT_TYPE } from "@/constants";
import { useAuth, useJob } from "@/models";
import { calculateDistance } from "@/utils";

import JobSave from "../JobSave";
import {
  getSearchAndFilterResult,
  JOB_POSTED_FILTER,
  OTHER_LANGUAGE_FILTER,
  WAGE_FILTER,
} from "./jobFilter";

export default function JobList() {
  const { listJobs } = useJob();
  const { jobId } = useParams();
  const { run, data } = useRequest(
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
  const auth = useAuth();

  const emptyFilter = {
    jobPosted: JOB_POSTED_FILTER[0],
    jobType: [],
    wage: "0",
    english: [],
    benefit: [],
    anyDistance: true,
    distance: "500",
    otherLanguage: [],
  };

  // useStates for filter and search
  const [filter, setFilter] = useState(emptyFilter);
  const [search, setSearch] = useState("");
  const [filteredJobs, setFilteredJobs] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  const searchRef = useRef();

  const { register, reset, watch, getValues, handleSubmit } = useForm({
    defaultValues: emptyFilter,
  });

  // submit Filter
  const onSubmit = (data) => {
    setFilter(data);
    setShowFilter(!showFilter);
  };

  const filterUI = useMemo(() => {
    if (showFilter) {
      return (
        <div className="absolute z-10 top-0 left-0 w-full h-full bg-base-100 overflow-scroll">
          {/* Top Bar */}
          <div className="sticky top-0 left-0 flex flex-row justify-between items-center w-full h-16 p-3 bg-base-200">
            <button
              className="btn bg-transparent btn-sm btn-outline border-0 underline"
              onClick={() => {
                reset(emptyFilter);
              }}
            >
              Reset
            </button>
            <span className="text-2xl font-bold">Filters</span>
            <CloseIcon
              fontSize="large"
              className="bg-base-200 cursor-pointer hover:bg-base-300 rounded-full p-1"
              onClick={() => {
                reset(filter);
                setShowFilter(!showFilter);
              }}
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
                  <label className="label text-xl" htmlFor="jobPosted">
                    Job Posted
                  </label>
                </div>

                {JOB_POSTED_FILTER.map((item, index) => {
                  return (
                    <label className="label cursor-pointer" key={index}>
                      <span className="text-lg">{item}</span>
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
                  <label className="label text-xl" htmlFor="jobType">
                    Job Type
                  </label>
                </div>

                {[SHIFT_TYPE.FULL_TIME, SHIFT_TYPE.PART_TIME].map((item, index) => {
                  return (
                    <label className="label cursor-pointer" key={index}>
                      <span className="text-lg">{item}</span>
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
                  <label className="label text-xl" htmlFor="wage">
                    Pay
                  </label>
                </div>

                {WAGE_FILTER.map((minWage, index) => {
                  return (
                    <label className="label cursor-pointer" key={index}>
                      <span className="text-lg">
                        {index === 0 ? "All" : `$ ${minWage}+ / hour`}
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
                  <AbcIcon fontSize="large" className="mr-1" />
                  <label className="label text-xl" htmlFor="english">
                    English Level
                  </label>
                </div>

                {[
                  ENGLISH_LEVEL.NOT_REQUIRED,
                  ENGLISH_LEVEL.BASIC,
                  ENGLISH_LEVEL.INTERMEDIATE,
                  ENGLISH_LEVEL.ADVANCED,
                ].map((englishLevel, index) => {
                  return (
                    <label className="label cursor-pointer" key={index}>
                      <span className="text-lg">{englishLevel}</span>
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

              {/* Other Language Category */}
              <div className="form-control pt-2">
                <div className="flex flex-row items-center">
                  <LanguageIcon fontSize="large" className="mr-1" />
                  <label className="label text-xl" htmlFor="otherLanguage">
                    Other Languages
                  </label>
                </div>

                {OTHER_LANGUAGE_FILTER.map((language, index) => {
                  return (
                    <label className="label cursor-pointer" key={index}>
                      <span className="text-lg">{language}</span>
                      <input
                        type="checkbox"
                        name="checkbox-otherLanguage"
                        className="checkbox checkbox-primary"
                        value={language}
                        {...register("otherLanguage")}
                      />
                    </label>
                  );
                })}
              </div>

              {/* Benefit Category */}
              <div className="form-control pt-2">
                <div className="flex flex-row items-center">
                  <LocalHospitalIcon fontSize="large" className="mr-1" />
                  <label className="label text-xl" htmlFor="benefit">
                    Benefit
                  </label>
                </div>

                {[BENEFIT_TYPE.MEDICAL, BENEFIT_TYPE.OTHERS].map((benefitType, index) => {
                  return (
                    <label className="label cursor-pointer" key={index}>
                      <span className="text-lg">{benefitType}</span>
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

              {/* Distance Category */}
              <div className="form-control pt-2">
                <div className="flex flex-row items-center">
                  <LocationOnIcon fontSize="large" className="mr-1" />
                  <label className="label text-xl" htmlFor="wage">
                    Distance
                  </label>
                </div>
                <label className="label cursor-pointer">
                  <span className="label-text">Any Distance</span>
                  <input
                    type="checkbox"
                    name="checkbox-distance"
                    className="checkbox checkbox-primary"
                    {...register("anyDistance")}
                  />
                </label>
                <label
                  className={
                    "label cursor-pointer" + (watch("anyDistance") ? " hidden" : "")
                  }
                >
                  <input
                    type="text"
                    name="distance"
                    className="input input-bordered w-full"
                    {...register("distance")}
                  />
                  <p className="ml-4">miles</p>
                </label>
              </div>

              {/* bottom submit button */}
              <div className="form-control pt-5 pb-5">
                <button className="btn btn-primary w-44" type="submit">
                  Show Results
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }, [showFilter, getValues()]);

  useEffect(() => {
    if (auth.user) {
      (async () => {
        await run();
      })();
    }
  }, []);

  // useEffect for filter and search
  useEffect(() => {
    const filteredResult = getSearchAndFilterResult(data, search, filter);
    setFilteredJobs(filteredResult);
  }, [filter, search, data]);

  const jobs = useMemo(() => {
    return filteredJobs
      ? filteredJobs.map((job) => {
          return (
            <li className="flex flex-row w-full mt-5 px-4" key={job.id}>
              <div
                className={`card card-compact w-full rounded-3xl border-2 flex flex-row justify-between ${
                  job.id && job.id == jobId
                    ? "border-primary"
                    : "border-base-300 bg-base-100 drop-shadow-lg"
                }`}
              >
                <Link to={job.id} className="card-body w-10/12 flex-none">
                  <div className="card-title text-xl w-full">{job.title}</div>
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
                </Link>
                <div className="card-actions w-2/12 items-center justify-center p-3">
                  <JobSave jobId={job.id} mode="list" />
                </div>
              </div>
            </li>
          );
        })
      : "Loading";
  }, [filteredJobs, jobId]);

  return (
    <div className="relative w-full flex flex-col min-w-0 bg-black-50">
      {/* Search bar and filter icon */}
      <div className="fixed w-full md:sticky md:top-0 z-10 flex flex-row flex-auto items-center justify-between h-16 p-3 bg-base-100">
        <div className="form-control">
          <div className="input-group">
            <input
              type="text"
              placeholder="Search job or company"
              className="input input-bordered"
              ref={searchRef}
              onKeyDown={(e) => {
                if (e.key === "Enter") setSearch(searchRef.current.value);
              }}
            />
            <button
              className="btn btn-square bg-primary border-primary"
              onClick={() => {
                setSearch(searchRef.current.value);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-base-100"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        <button
          className={
            _.isEqual(filter, emptyFilter)
              ? "btn btn-circle btn-ghost"
              : "btn btn-circle btn-primary"
          }
          onClick={() => setShowFilter(!showFilter)}
        >
          <FilterAltIcon fontSize="large" />
        </button>
      </div>

      {/* Filter Panel UI */}
      {filterUI}

      {/* Job List UI */}
      <ul className="menu w-full pt-16 min-w-0 md:pt-0">{jobs}</ul>
    </div>
  );
}
