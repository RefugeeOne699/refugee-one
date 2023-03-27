import { useRequest } from "ahooks";
import KeyIcon from "@mui/icons-material/Key";
import { useForm } from "react-hook-form";
import { useAuth } from "@/models";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ProfileSetPassword() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const { errorMessage, setErrorMessage } = useState("");

  const GetErrorMessage = (error) => {
    if (error.code === "password_not_match") {
      return "Passwords do not match";
    } else if (error.code === "auth/too-many-requests") {
      return "Too many trails, try again later";
    } else if (error.code === "auth/wrong-password") {
      return "Wrong password";
    } else {
      return "Unknown error";
    }
  };

  const {
    run: modifiedContent,
    error: modificationError,
    loading: modificationLoading,
  } = useRequest(
    async (data) => {
      if (data.newPassword !== data.checkPassword) {
        throw new Error("password_not_match", { code: "password_not_match" });
      } else {
        return auth.updatePassword(data);
      }
    },
    {
      manual: true,
      onSuccess: async () => {
        navigate("../account", { replace: true });
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  const handleCancel = () => {
    navigate("../account", { replace: true });
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(modifiedContent)}>
        <div className="w-full flex flex-col items-center">
          <ul className="menu bg-base-100 px-12 w-full rounded-box">
            <li>
              <div className="flex justify-between">
                <div className="flex justify-start gap-4">
                  <KeyIcon />
                </div>
                <div className="flex w-full justify-end">
                  <input
                    {...register("oldPassword", { required: true })}
                    type="text"
                    placeholder="old password"
                    className={
                      "input w-full input-bordered" +
                      (modificationError ? " input-error" : "")
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
                <div className="flex w-full justify-end">
                  <input
                    {...register("newPassword", { required: true })}
                    type="text"
                    placeholder="new password"
                    className={
                      "input w-full input-bordered" +
                      (modificationError ? " input-error" : "")
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
                <div className="flex w-full justify-end">
                  <input
                    {...register("checkPassword", { required: true })}
                    type="text"
                    placeholder="confirm password"
                    className={
                      "input w-full input-bordered" +
                      (modificationError ? " input-error" : "")
                    }
                  />
                </div>
              </div>
            </li>
          </ul>
          <>
            {modificationError ? (
              <p className="text-error">{GetErrorMessage(modificationError)}</p>
            ) : null}
            <button type="submit" className="btn btn-xs btn-md lg:btn-lg m-2">
              {modificationLoading ? "loading" : "Save Password"}
            </button>
            <button className="btn btn-xs btn-md lg:btn-lg m-2" onClick={handleCancel}>
              Cancel
            </button>
          </>
        </div>
      </form>
    </div>
  );
}
