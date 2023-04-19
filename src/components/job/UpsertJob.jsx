import { useRequest } from "ahooks";
import { React, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";

import { ENGLISH_LEVEL, JOB_STATUS, ROLES, SHIFT_TYPE, WAGE_TYPE } from "@/constants";
import { useAuth, useJob } from "@/models";
import { getCoordinate } from "@/utils";

import Center from "../Center";
import Spin from "../Spin";
const LOCAL_KEY = "REFUGEE_ONE_JOB_DRAFT";

function UpsertJobCore({ update }) {
  const auth = useAuth();
  const job = useJob();
  const navigate = useNavigate();
  const { jobId } = useParams();
  const location = useLocation();
  const from = location.state?.from || "/";

  const {
    run: getJob,
    data: jobData,
    loading: preparing,
  } = useRequest(async (jobId) => job.getJob(jobId), {
    manual: true,
    onSuccess: (data) => {
      // only admin or who creates the job can update the job
      if (update && auth.user.role !== ROLES.ADMIN && auth.user.uid != data.owner.uid) {
        toast.error("Access denied");
        navigate("/", { replace: true });
      }
      data.dateJobStart = data.dateJobStart.toDate().toISOString();
      loadData(data);
    },
    onError: (error) => {
      toast.error(`Failed to get job information: ${error}`);
    },
  });

  useEffect(() => {
    if (update) {
      (async () => getJob(jobId))();
    }
  }, []);

  // in update mode, we do not enable load draft feature
  const [showModal, setShowModal] = useState(
    !update && window.localStorage.getItem(LOCAL_KEY) !== null
  );

  const { register, handleSubmit, setValue, getValues } = useForm({
    // if jobData has a value, it means we are editing the job
    // if the user is an employer, has a company, autofill the company name
    defaultValues: jobData || {
      company: auth.user?.company || "",
      dateJobStart: Date.now(),
    },
  });

  const { run: upsertJob, loading } = useRequest(
    async (data) => {
      data.dateJobStart = new Date(data.dateJobStart);
      data.coordinate = await getCoordinate(
        data.address.street,
        data.address.city,
        data.address.state,
        data.address.zipcode
      );
      data.location = `${data.address.street}, ${data.address.city}, ${data.address.state} ${data.address.zipcode}`;
      // if an employer is editing the job, change the status to pending
      // excluding conditions when admin creates, approves, rejects, edits the job
      data.status =
        auth.user.role === ROLES.ADMIN ? JOB_STATUS.APPROVED : JOB_STATUS.PENDING;
      // edit
      if (jobData) {
        Object.entries(data).forEach(([key, value]) => {
          jobData[key] = value;
        });
        return job.updateJob(jobId, jobData);
      }
      // create
      return job.createJob({
        ...data,
        adminMessage: "",
        owner: auth.userRef,
        datePost: new Date(),
        dateCreated: new Date(),
      });
    },
    {
      manual: true,
      onSuccess: () => {
        toast.success(update ? "Update Job succeeded" : "Create Job succeeded");
        navigate(from);
      },
      onError: (error) => {
        toast.error(`${update ? "Update" : "Create"} Job failed: ${error.message}`);
      },
    }
  );

  const hideModal = () => {
    setShowModal(false);
  };

  const saveDraft = () => {
    window.localStorage.setItem(LOCAL_KEY, JSON.stringify(getValues()));
    toast.success("Draft saved!");
  };

  const loadData = (draft) => {
    setValue("title", draft.title);
    setValue("company", draft.company || auth.user?.company);
    setValue("jobType", draft.jobType);
    setValue("dateJobStart", draft.dateJobStart.slice(0, 10));
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
    setValue("instruction", draft.instruction);
  };

  const loadDraft = () => {
    try {
      const draft = JSON.parse(window.localStorage.getItem(LOCAL_KEY));
      loadData(draft);
      hideModal();
      window.localStorage.removeItem(LOCAL_KEY);
      toast.success("Load draft succeeded");
    } catch {
      toast.error("Load draft failed.");
    }
  };

  const modal = useMemo(() => {
    if (!showModal) {
      return null;
    }

    return (
      <div className="w-[80%] float m-auto">
        <div className="alert shadow-lg">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-info flex-shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>Load latest draft version?</span>
          </div>
          <div className="flex-none">
            <button
              type="button"
              className="btn btn-sm btn-outline btn-primary"
              onClick={hideModal}
            >
              Dismiss
            </button>
            <button type="button" className="btn btn-sm btn-primary" onClick={loadDraft}>
              Load
            </button>
          </div>
        </div>
      </div>
    );
  }, [showModal]);

  if (update && preparing) {
    return (
      <Center>
        <Spin className="w-10 h-10" />
      </Center>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center p-4">
      {modal}
      {update ? (
        <div className="flex flex-row justify-start w-full">
          <button
            className="btn"
            onClick={() => {
              history.back();
            }}
          >
            Back
          </button>
        </div>
      ) : null}
      <form onSubmit={handleSubmit(upsertJob)}>
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
          />
        </div>

        <div className="flex flex-row justify-between">
          <div className="flex flex-row mb-4 items-center w-1/2">
            <label className="label flex basis-44">Start Date</label>
            <div className="input ml-2 w-full">
              <div className="flex items-center justify-center">
                <div className="flex w-full">
                  <input
                    type="date"
                    className="input input-bordered w-full bg-transparent transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                    placeholder="Select a date"
                    {...register("dateJobStart", { required: true })}
                  />
                  <label
                    htmlFor="dateJobStart"
                    className="pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[1.15rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-neutral-200"
                  />
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
            {...register("shift", { required: true })}
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
        <div className="flex flex-row items-center mb-4">
          <label className="label flex basis-44" htmlFor="instruction">
            Instructions of applying for the job
          </label>
          <textarea
            type="text"
            rows="4"
            className="textarea textarea-bordered w-full"
            placeholder="Please specify the instructions of how to apply for this job."
            {...register("instruction", { required: true })}
          />
        </div>
        <div className="flex w-full justify-end mb-4">
          <div className="flex flex-row justify-around w-1/2">
            <button
              type="button"
              className={`btn btn-outline btn-primary w-1/3 ${update ? "invisible" : ""}`}
              onClick={saveDraft}
            >
              Save as draft
            </button>
            <button
              type="submit"
              className={`btn btn-primary w-1/3 ${loading ? "loading" : ""}`}
              onClick={() => {
                window.localStorage.removeItem(LOCAL_KEY);
              }}
              disabled={loading}
            >
              {loading ? "Loading" : "Submit"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function RequireAccess({ children }) {
  const auth = useAuth();
  if (auth.user.role === ROLES.ADMIN || auth.user.role === ROLES.EMPLOYER) {
    return children;
  } else {
    return <Navigate to="/" replace />;
  }
}

export default function UpsertJob({ update }) {
  return (
    <RequireAccess>
      <UpsertJobCore update={update} />
    </RequireAccess>
  );
}
