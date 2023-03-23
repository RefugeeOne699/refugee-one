import { useRequest } from "ahooks";
import KeyIcon from "@mui/icons-material/Key";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useAuth } from "@/models";

export default function ProfileAccount() {
  const auth = useAuth();
  const [edit, setEdit] = useState(false);
  const { register, handleSubmit } = useForm();

  const { run: modifiedContent, loading: modificationLoading } = useRequest(
    // fixme: temp hard code company
    async (data) => {
      console.log(data);
      // TODO: add modify password
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
    <div className="w-full">
      <form onSubmit={handleSubmit(modifiedContent)}>
        <div className="w-full flex flex-col items-center">
          <ul className="menu bg-base-100 px-12 w-full rounded-box">
            <li>
              {edit ? (
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
              ) : (
                <div className="flex justify-between">
                  <div className="flex justify-start gap-4">
                    <PersonIcon />
                    Name
                  </div>
                  <div className="flex justify-end">{auth.user?.name}</div>
                </div>
              )}
            </li>
            <li>
              {edit ? (
                <div className="flex justify-between">
                  <div className="flex justify-start gap-4">
                    <KeyIcon />
                  </div>
                  <div className="flex w-full justify-end">
                    <input
                      {...register("password", { required: true })}
                      type="text"
                      placeholder="password"
                      className="input w-full input-bordered"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex justify-between">
                  <div className="flex justify-start gap-4">
                    <KeyIcon />
                    Password
                  </div>
                  <div className="flex justify-end">********</div>
                </div>
              )}
            </li>
            <li>
              {edit ? (
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
              ) : (
                <div className="flex justify-between">
                  <div className="flex justify-start gap-4">
                    <PhoneIcon />
                    Phone Number
                  </div>
                  <div className="flex justify-end">{auth.user?.phone}</div>
                </div>
              )}
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
              className="btn btn-xs btn-md lg:btn-lg m-2"
              onClick={() => {
                setEdit(true);
              }}
            >
              Edit Profile
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
