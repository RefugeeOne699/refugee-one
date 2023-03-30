import KeyIcon from "@mui/icons-material/Key";
import { useRequest } from "ahooks";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/models";

export default function ProfileSetPassword() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [matchState, setMatchState] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
        if (error.code === "auth/too-many-requests") {
          toast.error("Try again later");
        } else if (error.code === "auth/wrong-password") {
          toast.error("Wrong password");
        } else {
          toast.error("Unknown error");
          console.log(error);
        }
      },
    }
  );

  const handleCancel = () => {
    navigate("../account", { replace: true });
  };

  const handleMatch = () => {
    if (newPassword === "") {
      setMatchState(false);
    } else if (newPassword === confirmPassword) {
      setMatchState(false);
    } else {
      console.log(newPassword + " " + confirmPassword);
      setMatchState(true);
    }
  };

  useEffect(() => {
    handleMatch();
  }, [newPassword, confirmPassword]);

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
                    className="input w-full input-bordered"
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
                      "input w-full input-bordered" + (matchState ? " input-error" : "")
                    }
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                    }}
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
                    type="text"
                    placeholder="confirm password"
                    className={
                      "input w-full input-bordered" + (matchState ? " input-error" : "")
                    }
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                    }}
                  />
                </div>
              </div>
            </li>
          </ul>
          <>
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
