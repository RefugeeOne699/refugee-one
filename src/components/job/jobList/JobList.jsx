import AbcIcon from "@mui/icons-material/Abc";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CloseIcon from "@mui/icons-material/Close";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import LanguageIcon from "@mui/icons-material/Language";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import _ from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";

import { BENEFIT_TYPE, ENGLISH_LEVEL, ROLES, SHIFT_TYPE } from "@/constants";
import { useAuth } from "@/models";

import JobSave from "../JobSave";
import {
  getSearchAndFilterResult,
  JOB_POSTED_FILTER,
  OTHER_LANGUAGE_FILTER,
  TIME_OF_DAY,
  WAGE_FILTER,
} from "./jobFilter";

export default function JobList({ data }) {
  const { jobId } = useParams();

  const emptyFilter = {
    jobPosted: JOB_POSTED_FILTER[0],
    jobType: [],
    wage: "0",
    english: [],
    benefit: [],
    distance: "500",
    anyDistance: true,
    otherLanguage: OTHER_LANGUAGE_FILTER[0],
    shiftTime: {
      start_after: "9am",
      end_before: "6pm",
    },
    anyShiftTime: "true", // this is a string because useform requires a string value for radio inputs
  };

  // useStates for filter and search
  const [filter, setFilter] = useState(emptyFilter);
  const [search, setSearch] = useState("");
  const [filteredJobs, setFilteredJobs] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  const searchRef = useRef();

  const { register, reset, watch, getValues, handleSubmit, setValue } = useForm({
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
                  ENGLISH_LEVEL.NONE,
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

                <select
                  className="select select-bordered w-[80%] max-w-xs my-3"
                  {...register("otherLanguage")}
                >
                  {OTHER_LANGUAGE_FILTER.map((language, key) => (
                    <option key={key}>{language}</option>
                  ))}
                </select>
              </div>

              {/* Shift Time Category */}
              <div className="form-control pt-2">
                <div className="flex flex-row items-center">
                  <WorkHistoryIcon fontSize="large" className="mr-1" />
                  <label className="label text-xl">Shift Time</label>
                </div>

                <label className="label cursor-pointer">
                  <span className="label-text text-lg">Any Shift Time</span>
                  <input
                    type="radio"
                    name="radio-anyShiftTime"
                    className="radio radio-primary"
                    value="true"
                    {...register("anyShiftTime")}
                  />
                </label>

                <label className="label cursor-pointer">
                  <span className="label-text text-lg">Specify Time</span>
                  <input
                    type="radio"
                    name="radio-anyShiftTime"
                    className="radio radio-primary"
                    value="false"
                    {...register("anyShiftTime")}
                  />
                </label>

                <div className={watch("anyShiftTime") === "true" ? "hidden" : ""}>
                  <label className="label ml-6">
                    <span> Start Time At/After</span>
                    <div className="form-control">
                      <div className="input-group">
                        <button
                          className="btn"
                          type="button"
                          onClick={() => {
                            const newIndex =
                              (TIME_OF_DAY.indexOf(watch("shiftTime.start_after")) -
                                1 +
                                TIME_OF_DAY.length) %
                              TIME_OF_DAY.length;
                            setValue("shiftTime.start_after", TIME_OF_DAY[newIndex]);
                          }}
                        >
                          -
                        </button>
                        <select
                          className="select select-bordered"
                          {...register("shiftTime.start_after")}
                        >
                          {TIME_OF_DAY.map((time, key) => (
                            <option key={key}>{time}</option>
                          ))}
                        </select>
                        <button
                          className="btn"
                          type="button"
                          onClick={() => {
                            const newIndex =
                              (TIME_OF_DAY.indexOf(watch("shiftTime.start_after")) + 1) %
                              TIME_OF_DAY.length;
                            setValue("shiftTime.start_after", TIME_OF_DAY[newIndex]);
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </label>

                  <label className="label ml-6">
                    <span> End Time At/Before</span>
                    <div className="form-control">
                      <div className="input-group">
                        <button
                          className="btn"
                          type="button"
                          onClick={() => {
                            const newIndex =
                              (TIME_OF_DAY.indexOf(watch("shiftTime.end_before")) -
                                1 +
                                TIME_OF_DAY.length) %
                              TIME_OF_DAY.length;
                            setValue("shiftTime.end_before", TIME_OF_DAY[newIndex]);
                          }}
                        >
                          -
                        </button>
                        <select
                          className="select select-bordered"
                          {...register("shiftTime.end_before")}
                        >
                          {TIME_OF_DAY.map((time, key) => (
                            <option key={key}>{time}</option>
                          ))}
                        </select>
                        <button
                          className="btn"
                          type="button"
                          onClick={() => {
                            const newIndex =
                              (TIME_OF_DAY.indexOf(watch("shiftTime.end_before")) + 1) %
                              TIME_OF_DAY.length;
                            setValue("shiftTime.end_before", TIME_OF_DAY[newIndex]);
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Distance Category */}
              <div className="form-control pt-2">
                <div className="flex flex-row items-center">
                  <LocationOnIcon fontSize="large" className="mr-1" />
                  <label className="label text-xl">Distance</label>
                </div>
                <label className="label cursor-pointer">
                  <span className="label-text text-lg">Any Distance</span>
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
                  <p className="ml-4">Within</p>
                  <input
                    type="text"
                    name="distance"
                    className="input input-bordered w-2/5"
                    {...register("distance")}
                  />
                  <p className="ml-4">miles</p>
                </label>
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

  // useEffect for filter and search
  useEffect(() => {
    const filteredResult = getSearchAndFilterResult(data, search, filter);
    setFilteredJobs(filteredResult);
  }, [filter, search, data]);

  const auth = useAuth();
  const enableJobSave = auth.user.role === ROLES.CLIENT;

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
                <Link
                  to={job.id}
                  className={`${
                    enableJobSave ? "w-10/12" : "w-full"
                  } card-body flex-none`}
                >
                  <div className="card-title w-full">
                    <p className="truncate">{job.title}</p>
                  </div>
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
                <div
                  className={`${
                    enableJobSave ? "" : "hidden"
                  } card-actions w-1/12 items-center justify-center `}
                >
                  <JobSave jobId={job.id} mode="list" />
                </div>
              </div>
            </li>
          );
        })
      : "Loading";
  }, [filteredJobs, jobId]);

  return (
    <div className="relative flex flex-col bg-base-100 h-full">
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
      <ul className="menu w-full overflow-x-scroll h-full flex flex-col flex-nowrap max-md:pt-16">
        {jobs}
      </ul>
    </div>
  );
}
