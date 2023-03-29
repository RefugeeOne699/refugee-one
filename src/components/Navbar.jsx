import { cloneElement, useState } from "react";
import { slide as Menu } from "react-burger-menu";
import { useNavigate } from "react-router-dom";

import { ROLES } from "@/constants";
import { useAuth } from "@/models";

import AddIcon from "@mui/icons-material/Add";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import GradeIcon from "@mui/icons-material/Grade";
import SettingsIcon from "@mui/icons-material/Settings";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import WorkIcon from "@mui/icons-material/Work";

const buttonMap = {
  [ROLES.ADMIN]: {
    buttons: {
      "Create Account": {
        icon: <AddIcon />,
        path: "",
      },
      "Post a Job": {
        icon: <AddIcon />,
        path: "addJob",
      },
    },
    navs: {
      "Find Jobs": {
        icon: <WorkIcon />,
        path: "jobs",
      },
      "Manage Jobs": {
        icon: <BusinessCenterIcon />,
        path: "admin",
      },
      "Manage Accounts": {
        icon: <SupervisorAccountIcon />,
        path: "",
      },
      Setting: {
        icon: <SettingsIcon />,
        path: "profile",
      },
    },
  },
  [ROLES.EMPLOYER]: {
    buttons: {
      "Post a Job": {
        icon: <AddIcon />,
        path: "addJob",
      },
    },
    navs: {
      "Manage Jobs": {
        icon: <WorkIcon />,
        path: "",
      },
      Setting: {
        icon: <SettingsIcon />,
        path: "profile",
      },
    },
  },
  [ROLES.CLIENT]: {
    buttons: {},
    navs: {
      "Find Jobs": {
        icon: <WorkIcon />,
        path: "jobs",
      },
      "Saved Jobs": {
        icon: <GradeIcon />,
        path: "",
      },
      Setting: {
        icon: <SettingsIcon />,
        path: "profile",
      },
    },
  },
};

function NavbarList(props) {
  const navigate = useNavigate();
  const auth = useAuth();

  return (
    <div className="w-full p-2 flex flex-col gap-8">
      {auth.user ? (
        <>
          <div className="w-full p-2 gap-4 text-black flex flex-col">
            {Object.keys(buttonMap[auth.user.role].buttons).map((key) => (
              <div
                key={key}
                className="border-2 border-yellow-600 rounded-2xl text-yellow-600 flex flex-row w-full h-12 justify-start content-center p-2 hover:bg-yellow-600 hover:text-white cursor-pointer"
                onClick={() => {
                  navigate(buttonMap[auth.user.role].buttons[key].path);
                  props.setOpen(false);
                }}
              >
                <div className="h-full flex flex-col justify-center px-2">
                  {cloneElement(buttonMap[auth.user.role].buttons[key].icon, {
                    className: "text-2xl",
                  })}
                </div>
                <div className="h-full flex flex-col justify-center font-semibold">
                  {key}
                </div>
              </div>
            ))}
          </div>
          <div className="w-full p-2 gap-4 text-black flex flex-col">
            {Object.keys(buttonMap[auth.user.role].navs).map((key) => (
              <div
                key={key}
                className="border-b-2 border-grey flex flex-row w-full h-12 justify-start content-center p-2 hover:bg-yellow-600 hover:text-white cursor-pointer"
                onClick={() => {
                  navigate(buttonMap[auth.user.role].navs[key].path);
                  props.setOpen(false);
                }}
              >
                <div className="h-full flex flex-col justify-center px-2">
                  {cloneElement(buttonMap[auth.user.role].navs[key].icon, {
                    className: "text-2xl",
                  })}
                </div>
                <div className="h-full flex flex-col justify-center font-semibold">
                  {key}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="md:hidden max-md:block">
        <Menu
          isOpen={open}
          onStateChange={(state) => setOpen(state.isOpen)}
          crossClassName={"bg-black"}
          overlayClassName={"opacity-25"}
          menuClassName={"bg-white px-4 pt-16 text-xl font-semibold"}
          burgerBarClassName={"bg-black"}
          burgerButtonClassName={"fixed top-12 left-12 z-50 w-12 h-8"}
        >
          <NavbarList setOpen={setOpen} />
        </Menu>
      </div>

      <div className="w-60 m-3 h-screen border-r-4 border-grey max-md:hidden">
        <NavbarList setOpen={setOpen} />
      </div>
    </>
  );
}
