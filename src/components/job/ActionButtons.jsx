import { useContext, useState } from "react";

import { ROLES } from "@/constants";
import { useAuth } from "@/models";
import { TabContext } from "@/pages/Job";

export default function ({ job }) {
  const auth = useAuth();
  const [hideFeedback, sethideFeedback] = useState(true);
  const currentTab = useContext(TabContext);

  if (auth.user.role === ROLES.CLIENT) {
    /* Client always displays one button that will toggle based on if job is saved or not */
    return (
      <button
        onClick={() => {
          /*save/unsave job */
        }}
        className="btn btn-success"
      >
        Save/Unsave TBD
      </button>
    );
  } else if (auth.user.role === ROLES.EMPLOYER) {
    /* Employer had EDIT and REJECT Buttons if job is approved, else just has EDIT*/
    if (currentTab !== "approved") {
      return (
        <div className="w-full flex flex-row justify-center">
          <button
            onClick={() => {
              /*go to edit job page*/
            }}
            className="btn btn-warning"
          >
            Edit Job
          </button>
        </div>
      );
    } else {
      return (
        <div className="w-full flex flex-row justify-center">
          <button
            onClick={() => {
              /*go to edit job page*/
            }}
            className="btn btn-warning mr-5"
          >
            Edit Job
          </button>
          <button
            onClick={() => {
              /* delete job and refresh page*/
            }}
            className="btn btn-error"
          >
            Remove Job
          </button>
        </div>
      );
    }
  } else if (auth.user.role === ROLES.ADMIN) {
    /* admin has APPROVE/REJECT proceedure for pending jobs, REJECT for approved jobs, and nothing for rejected jobs*/
    if (currentTab === "pending") {
      return (
        <div className="items-center text-center w-3/4">
          {hideFeedback ? (
            ""
          ) : (
            <div className="w-full">
              <label className="label">
                <span className="label-text">Reason for Rejection (Not Required)</span>
              </label>
              <textarea className="textarea textarea-bordered w-full"></textarea>
            </div>
          )}
          {hideFeedback ? (
            <div className="w-full flex flex-row justify-center">
              <button onClick={() => sethideFeedback(false)} className="btn btn-error">
                Reject
              </button>
              <button
                onClick={() => {
                  /*updateJob()*/
                }}
                className="btn btn-success ml-5"
              >
                Approve
              </button>
            </div>
          ) : (
            <div className="mt-5">
              <button onClick={() => sethideFeedback(true)} className="btn btn-warning">
                Undo
              </button>
              <button
                onClick={() => {
                  /*deleteJob()*/
                }}
                className="btn btn-error ml-5"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      );
    } else if (currentTab === "approved") {
      return (
        <div className="w-full flex flex-row justify-center">
          <button
            onClick={() => {
              /* delete job and refresh page*/
            }}
            className="btn btn-error"
          >
            Remove Job
          </button>
        </div>
      );
    }
  }
}
