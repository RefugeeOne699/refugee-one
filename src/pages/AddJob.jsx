import "react-datepicker/dist/react-datepicker.css";

import { useRequest } from "ahooks";
import { React } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { ENGLISH_LEVEL, JOB_STATUS, SHIFT_TYPE, WAGE_TYPE } from "@/constants";
import { useAuth, useJob } from "@/models";

export default function AddJob() {
  const auth = useAuth();
  const job = useJob();

  const navigate = useNavigate();
  const {
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
        //company: doc(database, "Companies", "KJLOQ9jWh9zsc3JfBugR"),
        adminMessage: "",
        company: auth.user.company,
        owner: auth.userRef,
        status: JOB_STATUS.PENDING,
        datePost: new Date(),
        location: `${data.address.street}, ${data.address.city}, ${data.address.state} ${data.address.zipcode}`,
        dateCreated: new Date(),
        // fixme: temp solution: we need an admin to approve the job
      }),
    {
      manual: true,
      onSuccess: () => {
        toast.success("Create Job succeeded");
        navigate("/");
      },
      onError: (e) => {
        toast.error("Create Job failed.");
        console.log(e);
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
            <label className="label flex basis-44">Start Date</label>
            <div className="input ml-2 w-full">
              <div className="flex items-center justify-center">
                <div className="flex w-full ">
                  <input
                    type="date"
                    className="input input-bordered w-full bg-transparent transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                    placeholder="Select a date"
                    {...register("dateJobStart", { required: true })}
                  />
                  <label
                    htmlFor="dateJobStart"
                    className="pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[1.15rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-neutral-200"
                  ></label>
                </div>
              </div>
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
              {Object.values(SHIFT_TYPE).map((type, index) => {
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
              {Object.values(WAGE_TYPE).map((type, index) => {
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
                {...register("wage.min", { required: true, valueAsNumber: true })}
              />
              <div>
                <span className="ml-4 mr-4 text-center self-center text-4xl"> - </span>
              </div>

              <input
                type="number"
                className="input input-bordered w-1/3"
                placeholder="Max $"
                {...register("wage.max", {
                  required: true,
                  valueAsNumber: true,
                })}
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
                  name="Medical"
                  className="scale-125"
                  {...register("benefit.hasMedical")}
                />
                <label className="pl-2">Medical</label>
              </div>

              <div className="self-center items-center w-1/3">
                <input
                  type="checkbox"
                  name="other"
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
              {...register("langEnglishLevel", { required: true })}
            >
              {Object.values(ENGLISH_LEVEL).map((type, index) => {
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
            placeholder="Please specify other requirements or/and skills required for job such as driver license, or other certifications needed."
            {...register("description", { required: true })}
          />
        </div>
        <div className="flex w-full justify-end mb-4">
          <div className="flex flex-row justify-around w-1/2">
            <button type="submit" className="btn btn-primary w-1/3">
              Submit
            </button>
            <button type="button" className="btn btn-outline btn-primary w-1/3">
              Save as draft
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
