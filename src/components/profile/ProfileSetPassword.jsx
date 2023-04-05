import KeyIcon from "@mui/icons-material/Key";
import { useRequest } from "ahooks";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/models";

const passwordMinLength = 6;

export default function ProfileSetPassword() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { register, watch, handleSubmit } = useForm();
  const [errorState, setErrorState] = useState([false, false, false]);
  const [checkErrorState, setCheckErrorState] = useState(false);
  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  const { run: modifiedContent, loading: modificationLoading } = useRequest(
    async (data) => {
      return auth.updatePassword(data);
    },
    {
      manual: true,
      onSuccess: async () => {
        toast.success("Password updated");
        navigate("../account", { replace: true });
      },
      onError: (error) => {
        let localErrorState = [...errorState];
        if (error.code === "auth/too-many-requests") {
          toast.error("Try again later");
        } else if (error.code === "auth/wrong-password") {
          toast.error("Wrong password");
          localErrorState[0] = true;
        } else if (error.code === "auth/weak-password") {
          toast.error("Password should be at least 6 characters");
          localErrorState[1] = true;
          localErrorState[2] = true;
        } else {
          toast.error("Unknown error");
        }
        setErrorState(localErrorState);
        setCheckErrorState(true);
      },
    }
  );

  const handleFormErrors = (errors) => {
    console.log(errors);
    const values = Object.values(errors);
    if (values.length > 0) {
      // always only prompt the first error, the same error that the cursor will focus on
      toast.error(values[0].message || "Errors in form input");
    }
    setCheckErrorState(true);
  };

  const handleCancel = () => {
    navigate("../account", { replace: true });
  };

  const handleVisualError = () => {
    let localErrorState = [...errorState];
    localErrorState[1] =
      newPassword !== confirmPassword || newPassword.length < passwordMinLength;
    localErrorState[2] =
      newPassword !== confirmPassword || confirmPassword.length < passwordMinLength;
    console.log(localErrorState);
    setErrorState(localErrorState);
  };

  useEffect(() => {
    if (checkErrorState) {
      handleVisualError();
    }
  }, [newPassword, confirmPassword, checkErrorState]);

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(modifiedContent, handleFormErrors)}>
        <div className="w-full flex flex-col items-center">
          <ul className="menu bg-base-100 px-12 w-full rounded-box">
            <li>
              <div className="flex justify-between">
                <div className="flex justify-start gap-4">
                  <KeyIcon />
                </div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Old password</span>
                  </label>
                  <input
                    {...register("oldPassword", { required: true })}
                    type="text"
                    placeholder=""
                    className={
                      "input input-bordered w-full " +
                      (errorState[0] ? " input-error" : "")
                    }
                  />
                </div>
              </div>
            </li>
            <li>
              <div className="flex justify-between">
                <div className="flex justify-start gap-4">
                  <KeyIcon />
                </div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">New password</span>
                  </label>
                  <input
                    {...register("newPassword", {
                      required: true,
                      minLength: {
                        value: passwordMinLength,
                        message: "Password should be at least 6 characters",
                      },
                    })}
                    type="text"
                    placeholder=""
                    className={
                      "input input-bordered w-full " +
                      (errorState[1] ? " input-error" : "")
                    }
                  />
                </div>
              </div>
            </li>
            <li>
              <div className="flex justify-between">
                <div className="flex justify-start gap-4">
                  <KeyIcon />
                </div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Confirm password</span>
                  </label>
                  <input
                    {...register("confirmPassword", {
                      required: true,
                      validate: (value) => {
                        if (watch("newPassword") === value) {
                          return true;
                        } else {
                          return "Password not match";
                        }
                      },
                      minLength: {
                        value: passwordMinLength,
                        message: "Password should be at least 6 characters",
                      },
                    })}
                    type="text"
                    placeholder=""
                    className={
                      "input input-bordered w-full " +
                      (errorState[2] ? " input-error" : "")
                    }
                  />
                </div>
              </div>
            </li>
          </ul>
          <div className="m-2 flex flex-col md:flex-row md:gap-4 justify-center">
            <button type="submit" className="btn btn-xs btn-md lg:btn-lg m-2">
              {modificationLoading ? "loading" : "Save Password"}
            </button>
            <button className="btn btn-xs btn-md lg:btn-lg m-2" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
