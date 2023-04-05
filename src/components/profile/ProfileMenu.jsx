import InfoIcon from "@mui/icons-material/Info";
import KeyIcon from "@mui/icons-material/Key";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { useRequest } from "ahooks";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "@/models";

export default function ProfileMenu() {
  const auth = useAuth();
  const navigate = useNavigate();

  const { run: signOut } = useRequest(async () => auth.signOut(), {
    manual: true,
    onSuccess: () => {
      toast.success("Logout successful");
      navigate("/", { replace: true });
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <ul className="menu bg-base-100 w-full px-12 rounded-box">
        <li className="w-full">
          <Link to="account" className="flex justify-between">
            <div className="flex justify-start gap-4">
              <PersonIcon />
              Account
            </div>
            <div className="flex justify-end">
              <KeyboardArrowRightIcon />
            </div>
          </Link>
        </li>
        <li className="w-full">
          <Link to="set_password" className="flex justify-between">
            <div className="flex justify-start gap-4">
              <KeyIcon />
              Change Password
            </div>
            <div className="flex justify-end">
              <KeyboardArrowRightIcon />
            </div>
          </Link>
        </li>
        <li className="w-full">
          <Link to="help" className="flex justify-between">
            <div className="flex justify-start gap-4">
              <InfoIcon />
              Help
            </div>
            <div className="flex justify-end">
              <KeyboardArrowRightIcon />
            </div>
          </Link>
        </li>
      </ul>
      <ul className="menu bg-base-100 w-full px-12 rounded-box mt-8">
        <li className="w-full">
          <a onClick={signOut} className="flex bg-red-800 text-white justify-between">
            <div className="flex justify-start gap-4">
              <LogoutIcon />
              Logout
            </div>
            <div className="flex justify-end">
              <KeyboardArrowRightIcon />
            </div>
          </a>
        </li>
      </ul>
    </div>
  );
}
