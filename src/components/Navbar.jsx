import AddIcon from "@mui/icons-material/Add";
import GradeIcon from "@mui/icons-material/Grade";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import WorkIcon from "@mui/icons-material/Work";
import { useEffect, useMemo, useState } from "react";
import { slide as Menu } from "react-burger-menu";
import { useLocation, useNavigate } from "react-router-dom";

import RefugeeOneLogo from "@/assets/refugeeone-logo-transparent.png";
import { AUTH_INITIAL_STATE, ROLES } from "@/constants";
import { useAuth } from "@/models";

const buttonMap = {
  [ROLES.ADMIN]: {
    buttons: {
      "Create Account": {
        icon: <AddIcon />,
        path: "admin/accounts/create",
      },
      "Post a Job": {
        icon: <AddIcon />,
        path: "addJob",
      },
    },
    navs: {
      "Find Jobs": {
        icon: <SearchIcon />,
        path: "jobs",
      },
      "Manage Jobs": {
        icon: <WorkIcon />,
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
        icon: <SearchIcon />,
        path: "employer/jobs",
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
        icon: <SearchIcon />,
        path: "jobs",
      },
      "Saved Jobs": {
        icon: <GradeIcon />,
        // todo: add path
        path: "jobsSaved",
      },
      Setting: {
        icon: <SettingsIcon />,
        path: "profile",
      },
    },
  },
};

function getFirstNav(role) {
  const navs = buttonMap[role].navs;
  const navKeys = Object.keys(navs);
  if (navKeys.length === 0) {
    return "/";
  }
  const firstNavKey = navKeys[0];
  return navs[firstNavKey].path;
}

function NavbarList(props) {
  const navigate = useNavigate();
  const auth = useAuth();
  const location = useLocation();
  const [selectedNavItem, setSelectedNavItem] = useState("");

  useEffect(() => {
    if (auth.user) {
      const path = location.pathname;
      if (path === "/" && Object.values(ROLES).includes(auth.user.role)) {
        navigate(getFirstNav(auth.user.role));
      }
    }
  }, [auth.user]);

  useEffect(() => {
    const path = location.pathname;
    if (path === undefined || path === "/" || auth.user === AUTH_INITIAL_STATE) {
      setSelectedNavItem("");
      return;
    }
    const selected = Object.keys(buttonMap[auth.user.role].navs).reduce(
      (prev, curr) => {
        const currPath = buttonMap[auth.user.role].navs[curr].path;
        if (path.includes(currPath) && currPath.length > prev.path.length) {
          return { nav: curr, path: currPath };
        }
        return prev;
      },
      { nav: null, path: "" }
    );
    setSelectedNavItem(selected?.nav);
  }, [auth.user, location.pathname]);

  const items = useMemo(() => {
    return (
      <>
        <div className="w-full p-2 gap-4 flex flex-col">
          {Object.keys(buttonMap[auth.user.role].buttons).map((key) => (
            <div
              key={key}
              className={
                "border-2 border-primary rounded-2xl text-primary flex flex-row w-full h-12 justify-start content-center p-2 hover:bg-primary hover:text-primary-content cursor-pointer" +
                (selectedNavItem === key ? " bg-primary text-primary-content" : "")
              }
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
        <div className="w-full p-2 gap-4 flex flex-col">
          {Object.keys(buttonMap[auth.user.role].navs).map((key) => (
            <div
              key={key}
              className={
                "border-b-2 border-grey flex flex-row w-full h-12 justify-start content-center p-2 hover:bg-primary hover:text-primary-content cursor-pointer" +
                (selectedNavItem === key ? " bg-primary text-primary-content" : "")
              }
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
  }, [auth.user, selectedNavItem]);
  return <div className="w-full p-2 flex flex-col gap-8">{items}</div>;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const auth = useAuth();
  if (!auth.user || auth.user === AUTH_INITIAL_STATE || !auth.user.role) {
    return null;
  }

  return (
    <>
      <div className="md:hidden max-md:block h-16">
        <div className="fixed top-0 left-0 z-50 w-full border-b-2 border-base-300 h-16 bg-base-100 flex flex-row justify-end">
          <div></div>
          <img
            src={RefugeeOneLogo}
            className="pt-1 m-3 h-auto max-width-full width-auto object-cover"
            alt="RefugeeOne Logo"
          />
        </div>
        <Menu
          isOpen={open}
          onStateChange={(state) => setOpen(state.isOpen)}
          crossButtonClassName={"mr-4"}
          crossClassName={"bg-base-content"}
          overlayClassName={"opacity-25"}
          menuClassName={
            "fixed top-0 left-0 bg-base-100 px-4 pt-16 text-lg font-semibold w-72"
          }
          burgerBarClassName={"bg-base-content"}
          burgerButtonClassName={"fixed top-6 left-6 z-50 w-6 h-4"}
          className={"fixed top-0 left-0 w-full h-full"}
        >
          <NavbarList setOpen={setOpen} />
        </Menu>
      </div>

      <div className="w-60 h-screen max-md:hidden"></div>

      <div className="fixed top-0 left-0 w-60 h-screen border-r-1 border-base-300 bg-base-200 max-md:hidden">
        <img src={RefugeeOneLogo} className="p-8" alt="RefugeeOne Logo" />
        <NavbarList setOpen={setOpen} />
      </div>
    </>
  );
}
