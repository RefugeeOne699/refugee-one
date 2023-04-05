import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import { useRequest } from "ahooks";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/models";

export default function ProfileSetProfile() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const { run: modifiedContent, loading: modificationLoading } = useRequest(
    async (data) => {
      return auth.updateProfile(data);
    },
    {
      manual: true,
      onSuccess: async () => {
        toast.success("Profile updated");
        navigate("../account", { replace: true });
      },
      onError: () => {
        toast.error("Profile update failed");
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
                  <PersonIcon />
                </div>
                <div className="flex w-full justify-end">
                  <input
                    {...register("name", { required: true })}
                    type="text"
                    placeholder="name"
                    value={auth.user?.name}
                    className="input w-full input-bordered"
                  />
                </div>
              </div>
            </li>
            <li>
              <div className="flex justify-between">
                <div className="flex justify-start gap-4">
                  <PhoneIcon />
                </div>
                <div className="flex w-full justify-end">
                  <input
                    {...register("phone", { required: true })}
                    type="text"
                    placeholder="phone number"
                    value={auth.user?.phone}
                    className="input w-full input-bordered"
                  />
                </div>
              </div>
            </li>
          </ul>
          <div className="flex flex-row w-full gap-4 justify-center">
            <button type="submit" className="btn btn-xs btn-md lg:btn-lg m-2">
              {modificationLoading ? "loading" : "Save Profile"}
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
