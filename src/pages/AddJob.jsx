import "react-datepicker/dist/react-datepicker.css";

import { useRequest } from "ahooks";
import { doc } from "firebase/firestore";
import { React } from "react";
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
        location: `${data.address.street}, ${data.address.city}, ${data.address.state} ${data.address.zipcode}`,
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
        <div className="flex flex-row mb-4 mt-4 items-center">
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
            <label className="label flex basis-44" htmlFor="dateJobStart">
              Start Date
            </label>
            <div className="input-group input ml-2">
              <div
                className="relative max-w-sm"
                style={{ zIndex: "9999", left: "16rem" }}
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
                name="dateJobStart"
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
            <label className="label flex basis-44 ml-4" htmlFor="jobType">
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
          <label className="label flex basis-44" htmlFor="shift">
            Shift Detail
          </label>
          <textarea
            type="text"
            rows="3"
            className="textarea textarea-bordered w-full"
            placeholder="Please enter shift details in the following format:
            Monday-Tuesday 8:30 AM to 1 PM
            Thursday - Friday 1 PM to 5 PM"
            {...register("shift")}
          ></textarea>
        </div>

        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row mb-4 items-center w-1/2">
            <label className="label flex basis-44" htmlFor="wage.type">
              Salary Type
            </label>
            <select
              className="input input-bordered w-4/5"
              {...register("wage.type", { required: true })}
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

          <div className="flex flex-row mb-4 w-1/2 items-center">
            <label className="label flex basis-44 ml-4">Salary Range</label>
            <div className="inline-flex w-full">
              <input
                type="number"
                className="input input-bordered w-1/3"
                placeholder="Min $"
                {...register("wage.min", { required: true })}
              />
              <div>
                <span className="ml-4 mr-4 text-center self-center text-4xl"> - </span>
              </div>

              <input
                type="number"
                className="input input-bordered w-1/3"
                placeholder="Max $"
                {...register("wage.max", { required: true })}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-row items-center w-full mb-4">
          <div className="flex flex-row items-center w-full">
            <label className="label flex basis-44">Benefits</label>
            <div className="flex flex-row w-full">
              <div className="self-center items-center w-1/3">
                <input
                  type="checkbox"
                  name="medical"
                  value="medical"
                  className="scale-125"
                  {...register("benefit.hasMedical")}
                />
                <label className="pl-2" htmlFor="hasMedical">
                  Medical
                </label>
              </div>
              <div className="self-center items-center w-1/3">
                <input
                  type="checkbox"
                  name="other"
                  value="other"
                  className="scale-125"
                  {...register("benefit.hasOthers")}
                />
                <label className="pl-2">Others</label>
              </div>
              <textarea
                type="text"
                rows="2"
                className="textarea textarea-bordered w-full"
                placeholder="Add other benefits provided"
                {...register("benefit.others")}
              ></textarea>
            </div>
          </div>
        </div>

        <div className="flex flex-row items-center mb-4 justify-between">
          <div className="flex flex-row items-center w-1/2">
            <label className="label flex basis-44" htmlFor="langEnglishLevel">
              English level
            </label>
            <select
              className="input input-bordered w-4/5"
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
          <div className="flex flex-row items-center w-1/2">
            <label className="label flex basis-48 ml-4" htmlFor="langNote">
              Other language(s)
            </label>
            <input
              type="text"
              className="input input-bordered w-4/5"
              {...register("langNote")}
            />
          </div>
        </div>

        <div className="flex flex-row items-center mb-4">
          <label className="label flex basis-44">Job Location</label>
          <div className="flex flex-row w-full justify-between">
            <input
              type="text"
              className="input input-bordered w-1/3"
              placeholder="Address"
              {...register("address.street", { required: true })}
            />
            <input
              type="text"
              className="input input-bordered w-1/5"
              placeholder="City"
              {...register("address.city", { required: true })}
            />
            <input
              type="text"
              className="input input-bordered w-1/6"
              placeholder="State"
              {...register("address.state", { required: true })}
            />
            <input
              type="number"
              className="input input-bordered w-1/6"
              placeholder="Zip code"
              {...register("address.zipcode", { required: true })}
            />
          </div>
        </div>

        <div className="flex flex-row items-center mb-4">
          <label className="label flex basis-44" htmlFor="description">
            Job Description
          </label>
          <textarea
            type="text"
            rows="10"
            className="textarea textarea-bordered w-full"
            {...register("description", { required: true })}
          />
        </div>
        <div className="flex w-full justify-end mb-4">
          <div className="flex flex-row justify-around w-1/2">
            <button type="submit" className="btn btn-primary w-1/3">
              Submit
            </button>
            <button className="btn btn-outline btn-primary w-1/3">Save as draft</button>
          </div>
        </div>
      </form>
    </div>
  );
}
