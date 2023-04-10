import AddIcon from "@mui/icons-material/Add";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import GradeIcon from "@mui/icons-material/Grade";
import SettingsIcon from "@mui/icons-material/Settings";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import WorkIcon from "@mui/icons-material/Work";
import { useMemo, useState } from "react";
import { slide as Menu } from "react-burger-menu";
import { useNavigate } from "react-router-dom";

import { AUTH_INITIAL_STATE, ROLES } from "@/constants";
import { useAuth } from "@/models";

const buttonMap = {
  [ROLES.ADMIN]: {
    buttons: {
      "Create Account": {
        icon: <AddIcon />,
        // todo: add path
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
        path: "admin/jobs",
      },
      "Manage Accounts": {
        icon: <SupervisorAccountIcon />,
        // todo: add path
        path: "admin/users",
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
        // todo: add path
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
        // todo: add path
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
  const items = useMemo(() => {
    return (
      <>
        <div className="w-full p-2 gap-4 text-black flex flex-col">
          {/* todo: fix dark mode compatibility */}
          {Object.keys(buttonMap[auth.user.role].buttons).map((key) => (
            <div
              key={key}
              className="border-2 border-primary rounded-2xl text-primary flex flex-row w-full h-12 justify-start content-center p-2 hover:bg-primary hover:text-white cursor-pointer"
              onClick={() => {
                navigate(buttonMap[auth.user.role].buttons[key].path);
                props.setOpen(false);
              }}
            >
              <div className="h-full flex flex-col justify-center px-2 text-2xl">
                {buttonMap[auth.user.role].buttons[key].icon}
              </div>
              <div className="h-full flex flex-col justify-center font-semibold">
                {key}
              </div>
            </div>
          ))}
        </div>
        <div className="w-full p-2 gap-4 text-black flex flex-col">
          {/* todo: fix dark mode compatibility */}
          {Object.keys(buttonMap[auth.user.role].navs).map((key) => (
            <div
              key={key}
              className="border-b-2 border-grey flex flex-row w-full h-12 justify-start content-center p-2 hover:bg-primary hover:text-white cursor-pointer"
              onClick={() => {
                navigate(buttonMap[auth.user.role].navs[key].path);
                props.setOpen(false);
              }}
            >
              <div className="h-full flex flex-col justify-center px-2 text-2xl">
                {buttonMap[auth.user.role].navs[key].icon}
              </div>
              <div className="h-full flex flex-col justify-center font-semibold">
                {key}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }, [auth.user]);
  return <div className="w-full p-2 flex flex-col gap-8">{items}</div>;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const auth = useAuth();
  if (!auth.user || auth.user === AUTH_INITIAL_STATE || !auth.user.role ) {
    return null;
  }

  return (
    <>
      <div className="md:hidden max-md:block h-16">
        <div className="fixed top-0 left-0 z-50 w-full border-b-4 border-grey h-16 bg-white"></div>
        {/* todo: fix dark mode compatibility */}
        <Menu
          isOpen={open}
          onStateChange={(state) => setOpen(state.isOpen)}
          crossButtonClassName={"mr-4"}
          crossClassName={"bg-black"}
          // todo: fix dark mode compatibility
          overlayClassName={"opacity-25"}
          menuClassName={"fixed top-0 left-0 bg-white px-4 pt-16 text-xl font-semibold"}
          // todo: fix dark mode compatibility
          burgerBarClassName={"bg-black"}
          // todo: fix dark mode compatibility
          burgerButtonClassName={"fixed top-4 left-4 z-50 w-10 h-8"}
          className={"fixed top-0 left-0 w-full h-full"}
        >
          <NavbarList setOpen={setOpen} />
        </Menu>
      </div>

      <div className="w-60 h-screen max-md:hidden">
        {/* todo: fix dark mode compatibility */}
        <NavbarList setOpen={setOpen} />
      </div>

      <div className="fixed top-0 left-0 w-60 h-screen border-r-4 border-grey bg-white max-md:hidden">
        {/* todo: fix dark mode compatibility */}
        <NavbarList setOpen={setOpen} />
      </div>
    </>
  );
}
