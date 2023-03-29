import { useRequest } from "ahooks";
import { React, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
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
    getValues,
    setValue,
    // formState: { errors }
  } = useForm();
  console.log(job);
  const { run: addJob } = useRequest(
    async (data) =>
      job.createJob({
        ...data,
        // fixme: temp demo solution
        // company: doc(database, "Companies", "KJLOQ9jWh9zsc3JfBugR"),
        company: auth.user.company,
        owner: auth.userRef,
        status: JOB_STATUS.PENDING,
        datePost: new Date(),
        location: `${data.address.street}, ${data.address.city}, ${data.address.state} ${data.address.zipcode}`,
        adminMessage: "",
        dateCreated: new Date(),
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

  useEffect(() => {
    let hasdraft = window.localStorage.getItem("draft");
    if (hasdraft !== null) {
      toast(
        (t) => (
          <div className="flex flex-row justify-between w-[400px]">
            <div className="w-1/2">
              <p>Load draft?</p>
            </div>
            <div className="flex flex-row w-1/2 justify-between">
              <button
                onClick={() => {
                  loadDraft();
                  toast.dismiss(t.id);
                }}
              >
                Load
              </button>
              <button onClick={() => toast.dismiss(t.id)}>Dismiss</button>
            </div>
          </div>
        ),
        { duration: 1000000 }
      );
    }
  }, []);

  const saveDraft = () => {
    window.localStorage.setItem("draft", JSON.stringify(getValues()));
    toast.success("Draft saved!");
    navigate("/");
  };

  const loadDraft = () => {
    const draft = JSON.parse(window.localStorage.getItem("draft"));
    //console.log(typeof draft);
    setValue("title", draft.title);
    setValue("jobType", draft.jobType);
    setValue("dateJobStart", draft.dateJobStart);
    console.log(draft.dateJobStart.split("T")[0]);
    setValue("shift", draft.shift);
    setValue("wage.type", draft.wage.type);
    setValue("wage.min", parseInt(draft.wage.min));
    setValue("wage.max", parseInt(draft.wage.max));
    setValue("benefit.hasMedical", draft.benefit.hasMedical);
    setValue("benefit.hasOthers", draft.benefit.hasOthers);
    setValue("benefit.others", draft.benefit.others);
    setValue("langEnglishLevel", draft.langEnglishLevel);
    setValue("langNote", draft.langNote);
    setValue("address.street", draft.address.street);
    setValue("address.city", draft.address.city);
    setValue("address.state", draft.address.state);
    setValue("address.zipcode", draft.address.zipcode);
    setValue("description", draft.description);
  };

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
                    {...register("dateJobStart", { setValueAs: (v) => new Date(v) })}
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
              {}
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
            {...register("description", { required: true })}
          />
        </div>
        <div className="flex w-full justify-end mb-4">
          <div className="flex flex-row justify-around w-1/2">
            <button
              type="submit"
              className="btn btn-primary w-1/3"
              onClick={() => {
                window.localStorage.clear();
              }}
            >
              Submit
            </button>
            <button
              type="button"
              className="btn btn-outline btn-primary w-1/3"
              onClick={saveDraft}
            >
              Save as draft
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
