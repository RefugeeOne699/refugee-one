import { useRequest } from "ahooks";
import KeyIcon from "@mui/icons-material/Key";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useAuth } from "@/models";
import { useNavigate } from "react-router-dom";

export default function ProfileAccount() {
  const auth = useAuth();
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <div className="w-full flex flex-col items-center">
        <ul className="menu bg-base-100 px-12 w-full rounded-box">
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
        </ul>
        <button
          className="btn btn-xs btn-md lg:btn-lg m-2"
          onClick={() => {
            navigate("../set_profile", { replace: true });
          }}
        >
          Edit Profile
        </button>
        <button
          className="btn btn-xs btn-md lg:btn-lg m-2"
          onClick={() => {
            navigate("../set_password", { replace: true });
          }}
        >
          Change Password
        </button>
      </div>
    </div>
  );
}
