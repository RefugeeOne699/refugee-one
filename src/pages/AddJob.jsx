import "react-datepicker/dist/react-datepicker.css";

import { useRequest } from "ahooks";
import { doc } from "firebase/firestore";
import React from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import database from "@/clients/firebase";
import { useAuth, useJob } from "@/models";
import { englishLevel } from "@/utils/constants";

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
        company: auth.user.company,
        owner: auth.userRef,
        status: "open",
        postDate: new Date(),
        // fixme: temp solution: we need an admin to approve the job
        admin: doc(database, "Users", "iKGlSJEUkWQjCHZMQhgrVixVAt42"),
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
        <div className="form-control">
          <label className="label" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            className="input input-bordered"
            {...register("title", { required: true })}
          />
        </div>
        <div className="form-control">
          <label className="label" htmlFor="company">
            Company Name
          </label>
          <input
            type="text"
            className="input input-bordered"
            {...register("company")}
            disabled
          />
        </div>
        <div className="form-control">
          <label className="label" htmlFor="startDate">
            Start Date
          </label>
          <div className="input-group">
            <div
              className="relative max-w-sm"
              style={{ zIndex: "9999", left: "17rem", top: "-0.5rem" }}
            >
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
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
                  className="input w-full max-w-xs input-bordered mb-4"
                  // className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholderText="Select Start Date"
                  onChange={(date) => field.onChange(date)}
                  selected={field.value}
                />
              )}
            />
          </div>
        </div>
        <div className="form-control">
          <label className="label" htmlFor="wage">
            Wages
          </label>
          <div style={{ display: "inline-flex" }}>
            <label className="input-group input-md">
              <span>Min Wage</span>
              <input
                type="number"
                className="input input-bordered"
                {...register("minWage", { required: true })}
              />
              <span>USD</span>
            </label>
            <span> - </span>
            <label className="input-group input-md">
              <span>Max Wage</span>
              <input
                type="number"
                className="input input-bordered"
                {...register("maxWage", { required: true })}
              />
              <span>USD</span>
            </label>
          </div>
        </div>
        <div className="form-control">
          <label className="label" htmlFor="location">
            Job Location
          </label>
          <input
            type="text"
            className="input input-bordered"
            {...register("location", { required: true })}
          />
        </div>
        <div className="form-control">
          <label className="label" htmlFor="englishLevel">
            English Level
          </label>
          <select
            className="input input-bordered"
            {...register("englishLevel", { required: true })}
          >
            {englishLevel.map((type, index) => {
              return (
                <option value={type} key={index}>
                  {type}
                </option>
              );
            })}
          </select>
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
      </form>
    </div>
  );
}
