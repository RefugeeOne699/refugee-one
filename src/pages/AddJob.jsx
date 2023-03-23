import "react-datepicker/dist/react-datepicker.css";

import { useRequest } from "ahooks";
import { doc } from "firebase/firestore";
import React from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import database from "@/clients/firebase";
import { ENGLISH_LEVEL, JOB_STATUS, JOB_TYPE, SALARY_TYPE } from "@/constants";
import { useAuth, useJob } from "@/models";

export default function AddJob() {
  const auth = useAuth();
  const job = useJob();
  const navigate = useNavigate();
  const {
    control,
    register,
    handleSubmit,
    // formState: { errors }
  } = useForm();
  console.log(job);
  const { run: addJob } = useRequest(
    async (data) =>
      job.createJob({
        ...data,
        // fixme: temp demo solution
        company: doc(database, "Companies", "KJLOQ9jWh9zsc3JfBugR"),
        // company: auth.user.company,
        owner: auth.userRef,
        status: JOB_STATUS.PENDING,
        postDate: new Date(),
        // fixme: temp solution: we need an admin to approve the job
      }),
    {
      manual: true,
      onSuccess: () => {
        navigate("/");
      },
      onError: () => {
        //todo: handle error
        //   console.error(error);
      },
    }
  );

  return (
    <div className="flex flex-col justify-center items-center">
      <form onSubmit={handleSubmit(addJob)}>
        <div className="flex flex-row mb-4 items-center">
          <label className="label flex basis-44" htmlFor="title">
            Job Title
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            {...register("title", { required: true })}
          />
        </div>
        <div className="flex flex-row mb-4 items-center">
          <label className="label flex basis-44" htmlFor="company">
            Company Name
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            {...register("company")}
            disabled
          />
        </div>

        <div className="flex flex-row justify-between">
          <div className="flex flex-row mb-4 items-center w-1/2">
            <label className="label flex basis-44" htmlFor="startDate">
              Start Date
            </label>
            <div className="input-group input">
              <div
                className="relative max-w-sm"
                style={{ zIndex: "9999", left: "14rem" }}
              >
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    aria-hidden="true"
                    className="w-8 h-8 text-gray-500 dark:text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
              </div>
              <Controller
                name="dateInput"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    className="input w-full max-w-xs input-bordered"
                    // className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholderText="Select Start Date"
                    onChange={(date) => field.onChange(date)}
                    selected={field.value}
                  />
                )}
              />
            </div>
          </div>

          <div className="dropdown dropdown-right flex flex-row mb-4 items-center w-1/2">
            <label className="label flex basis-40" htmlFor="jobType">
              Job Type
            </label>
            <select
              className="input input-bordered w-full"
              {...register("jobType", { required: true })}
            >
              {JOB_TYPE.map((type, index) => {
                return (
                  <option value={type} key={index}>
                    {type}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="flex flex-row items-center w-full mb-4">
          <label className="label flex basis-44">Shift Detail</label>
          <textarea
            type="text"
            rows="3"
            className="textarea textarea-bordered w-full"
            placeholder="Please enter shift details in the following format:
            Monday-Tuesday 8:30 AM to 1 PM
            Thursday - Friday 1 PM to 5 PM"
            {...register("shiftDetail", { required: true })}
          ></textarea>
        </div>

        <div className="flex flex-row justify-between">
          <div className="flex flex-row  mb-4 items-center w-1/3">
            <label className="label flex basis-44" htmlFor="salaryType">
              Salary Type
            </label>
            <select
              className="input input-bordered w-full"
              {...register("salaryType", { required: true })}
            >
              {SALARY_TYPE.map((type, index) => {
                return (
                  <option value={type} key={index}>
                    {type}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex flex-row w-1/2 items-center">
            <label className="label flex basis-44">Salary Range</label>
            <div className="inline-flex">
              <input
                type="number"
                className="input input-bordered w-1/2"
                {...register("minWage", { required: true })}
              />
              <span> - </span>
              <input
                type="number"
                className="input input-bordered w-1/2"
                {...register("maxWage", { required: true })}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex flex-row items-center">
            <label className="label flex basis-44">Benefits</label>
            <div className="flex flex-row">
              <div>
                <input type="checkbox" name="medical" value="medical" />
                <label>Medical</label>
              </div>
              <div>
                <input type="checkbox" name="other" value="other" />
                <label>Others</label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center w-1/3">
            <label className="label flex basis-44" htmlFor="englishLevel">
              English level
            </label>
            <select
              className="input input-bordered w-full"
              {...register("englishLevel", { required: true })}
            >
              {ENGLISH_LEVEL.map((type, index) => {
                return (
                  <option value={type} key={index}>
                    {type}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex flex-row items-center ">
            <label className="label flex basis-44" htmlFor="otherLanguage">
              Other language(s)
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              {...register("otherLanguage")}
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="address">
            Job Location
          </label>
          <input
            type="text"
            className="input input-bordered"
            placeholder="Address"
            {...register("address", { required: true })}
          />
          <input
            type="text"
            className="input input-bordered"
            placeholder="City"
            {...register("city", { required: true })}
          />
          <input
            type="text"
            className="input input-bordered"
            placeholder="State"
            {...register("state", { required: true })}
          />
          <input
            type="number"
            className="input input-bordered"
            placeholder="Zip code"
            {...register("zipcode", { required: true })}
          />
        </div>
        <div className="form-control">
          <label className="label" htmlFor="description">
            Job Description
          </label>
          <textarea
            type="text"
            rows="10"
            className="textarea textarea-bordered"
            {...register("description", { required: true })}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit Job Listing
        </button>

        <button className="btn btn-outline btn-primary">Save as draft</button>
      </form>
    </div>
  );
}
