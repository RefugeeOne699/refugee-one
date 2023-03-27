import { useRequest } from "ahooks";
import KeyIcon from "@mui/icons-material/Key";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import { useForm } from "react-hook-form";
import { useAuth } from "@/models";
import { useNavigate } from "react-router-dom";

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
        navigate("../account", { replace: true });
      },
      onError: (error) => {
        console.error(error);
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
                    className="input w-full input-bordered"
                  />
                </div>
              </div>
            </li>
          </ul>
          <>
            <button type="submit" className="btn btn-xs btn-md lg:btn-lg m-2">
              {modificationLoading ? "loading" : "Save Profile"}
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
