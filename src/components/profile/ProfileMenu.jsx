import InfoIcon from "@mui/icons-material/Info";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { Link } from "react-router-dom";

export default function ProfileMenu() {
  return (
    <div className="w-2/3 flex flex-col justify-center items-center">
      <ul className="menu bg-base-100 w-full p-2 rounded-box">
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
          <a className="flex justify-between">
            <div className="flex justify-start gap-4">
              <InfoIcon />
              Help
            </div>
            <div className="flex justify-end">
              <KeyboardArrowRightIcon />
            </div>
          </a>
        </li>
        <li className="w-full">
          <a className="flex justify-between">
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
