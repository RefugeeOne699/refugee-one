import { useRequest } from "ahooks";
import KeyIcon from "@mui/icons-material/Key";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useAuth } from "@/models";
import { Navigate } from "react-router-dom";

export default function ProfileAccount() {
  const auth = useAuth();
  const [edit, setEdit] = useState(false);
  const { register, handleSubmit } = useForm();

  const { run: modifiedContent, loading: modificationLoading } = useRequest(
    // fixme: temp hard code company
    async (data) => {
      console.log(data);
      return auth.updateProfile(data);
    },
    {
      manual: true,
      onSuccess: async () => {
        setEdit(false);
        location.reload();
      },
      onError: (error) => {
        console.error(error);
      },
    }
  );

  return (
    <>
      <form onSubmit={handleSubmit(modifiedContent)}>
        <div className="w-full flex flex-col justify-center items-center">
          <ul className="menu bg-base-100 w-full px-12 rounded-box">
            <li className="w-full">
              <div className="flex justify-between">
                <div className="flex justify-start gap-4">
                  <PersonIcon />
                  Name
                </div>
                <div className="flex justify-end">
                  {edit ? (
                    <input
                      {...register("name", { required: true })}
                      type="text"
                      className="input w-full max-w-xs input-bordered mb-4"
                    />
                  ) : (
                    auth.user?.name
                  )}
                </div>
              </div>
            </li>
            <li>
              <div className="flex justify-between">
                <div className="flex justify-start gap-4">
                  <KeyIcon />
                  password
                </div>
                <div className="flex justify-end">
                  {edit ? (
                    <input
                      {...register("password", { required: true })}
                      type="password"
                      className="input w-full max-w-xs input-bordered mb-4"
                    />
                  ) : (
                    "********"
                  )}
                </div>
              </div>
            </li>
            <li>
              <div className="flex justify-between">
                <div className="flex justify-start gap-4">
                  <PhoneIcon />
                  Phone Number
                </div>
                <div className="flex justify-end">
                  {edit ? (
                    <input
                      {...register("phone", { required: true })}
                      type="text"
                      className="input w-full max-w-xs input-bordered mb-4"
                    />
                  ) : (
                    auth.user?.phone
                  )}
                </div>
              </div>
            </li>
          </ul>
          {edit ? (
            <>
              <button type="submit" className="btn btn-xs btn-md lg:btn-lg m-2">
                {modificationLoading ? "loading" : "Save Profile"}
              </button>
              <button
                className="btn btn-xs btn-md lg:btn-lg m-2"
                onClick={() => {
                  setEdit(false);
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              className="btn btn-xs btn-md lg:btn-lg"
              onClick={() => {
                setEdit(true);
              }}
            >
              Edit Profile
            </button>
          )}
        </div>
      </form>
    </>
  );
}
