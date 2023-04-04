import KeyIcon from "@mui/icons-material/Key";
import { useRequest } from "ahooks";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/models";

export default function ProfileSetPassword() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { register, watch, handleSubmit } = useForm();

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
        } else if (error.code === "auth/weak-password") {
          toast.error("Password should be at least 6 characters");
        } else {
          toast.error("Unknown error");
        }
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
  };

  const handleCancel = () => {
    navigate("../account", { replace: true });
  };

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
                    className={"input w-full input-bordered"}
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
                    {...register("confirmPassword", {
                      required: true,
                      validate: (value) => watch("newPassword") === value,
                    })}
                    type="text"
                    placeholder="confirm password"
                    className={"input w-full input-bordered"}
                  />
                </div>
              </div>
            </li>
          </ul>
          <button type="submit" className="btn btn-xs btn-md lg:btn-lg m-2">
            {modificationLoading ? "loading" : "Save Password"}
          </button>
          <button className="btn btn-xs btn-md lg:btn-lg m-2" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
