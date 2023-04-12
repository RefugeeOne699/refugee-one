import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import PlaceIcon from "@mui/icons-material/Place";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/models";

export default function ProfileAccount() {
  const auth = useAuth();
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <div className="w-full flex flex-col items-center">
        <ul className="menu bg-base-100 px-12 w-full rounded-box max-md:hidden">
          <li>
            <div className="flex justify-between">
              <div className="flex justify-start gap-4">
                <PersonIcon />
                Name
              </div>
              <div className="flex justify-end">{auth.user?.name}</div>
            </div>
          </li>
          <li>
            <div className="flex justify-between">
              <div className="flex justify-start gap-4">
                <PhoneIcon />
                Phone Number
              </div>
              <div className="flex justify-end">{auth.user?.phone}</div>
            </div>
          </li>
          <li>
            <div className="flex justify-between">
              <div className="flex justify-start gap-4">
                <PlaceIcon />
                Address
              </div>
              <div className="flex justify-end">
                {auth.user?.address?.street +
                  ", " +
                  auth.user?.address?.city +
                  ", " +
                  auth.user?.address?.state +
                  ", " +
                  auth.user?.address?.zipcode}
              </div>
            </div>
          </li>
        </ul>
        <ul className="menu bg-base-100 px-12 w-full rounded-box md:hidden">
          <li>
            <div className="flex justify-between">
              <div className="flex justify-start gap-4">
                <PersonIcon />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <div className="flex justify-start">{auth.user?.name} </div>
              </div>
            </div>
          </li>
          <li>
            <div className="flex justify-between">
              <div className="flex justify-start gap-4">
                <PhoneIcon />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Phone Number</span>
                </label>
                <div className="flex justify-start">{auth.user?.phone} </div>
              </div>
            </div>
          </li>
          <li>
            <div className="flex justify-between">
              <div className="flex justify-start gap-4">
                <PlaceIcon />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Address</span>
                </label>
                <div className="flex justify-start">
                  {auth.user?.address?.street +
                    ", " +
                    auth.user?.address?.city +
                    ", " +
                    auth.user?.address?.state +
                    ", " +
                    auth.user?.address?.zipcode}
                </div>
              </div>
            </div>
          </li>
        </ul>
        <div className="mt-4 m-2 flex flex-col md:flex-row md:gap-4 justify-center">
          <button
            className="btn btn-primary btn-xs btn-md lg:btn-lg m-2"
            onClick={() => {
              navigate("../set_profile", { replace: true });
            }}
          >
            Edit Profile
          </button>
          <button
            className="btn btn-outline btn-xs btn-md lg:btn-lg m-2"
            onClick={() => {
              navigate("../", { replace: true });
            }}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
