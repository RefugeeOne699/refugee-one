import { useState } from "react";
import { slide as Menu } from "react-burger-menu";
import { useNavigate } from "react-router-dom";

import { ROLES } from "@/constants";
import { useAuth } from "@/models";

import AddIcon from "@mui/icons-material/Add";

const buttonMap = {
  [ROLES.ADMIN]: {
    buttons: {
      "Create Account": {
        icon: <AddIcon />,
        path: "",
      },
      "Post a Job": {
        icon: <AddIcon />,
        path: "",
      },
    },
    navs: {
      "Manage Jobs": {
        icon: <AddIcon />,
        path: "",
      },
      "Manage Accounts": {
        icon: <AddIcon />,
        path: "",
      },
      Setting: {
        icon: <AddIcon />,
        path: "",
      },
    },
  },
  [ROLES.EMPLOYER]: {
    buttons: {
      "Post a Job": {
        icon: <AddIcon />,
        path: "",
      },
    },
    navs: {
      "Manage Jobs": {
        icon: <AddIcon />,
        path: "",
      },
      Setting: {
        icon: <AddIcon />,
        path: "",
      },
    },
  },
  [ROLES.CLIENT]: {
    buttons: {
      "Create Account": {
        icon: <AddIcon />,
        path: "",
      },
      "Post a Job": {
        icon: <AddIcon />,
        path: "",
      },
    },
    navs: {
      "Find Jobs": {
        icon: <AddIcon />,
        path: "",
      },
      "Saved Jobs": {
        icon: <AddIcon />,
        path: "",
      },
      Setting: {
        icon: <AddIcon />,
        path: "",
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
          <ul className="menu w-full p-2 gap-5 text-black">
            {Object.keys(buttonMap[auth.user.role].buttons).map((key) => (
              <li
                key={key}
                className="border-2 border-yellow-600 rounded-2xl text-yellow-600"
              >
                {buttonMap[auth.user.role].buttons[key].path.icon}
                <button
                  onClick={() => {
                    navigate(buttonMap[auth.user.role].buttons[key].path);
                    props.setOpen(false);
                  }}
                >
                  {key}
                </button>
              </li>
            ))}
          </ul>
          <ul className="menu w-full p-2 gap-5 text-black">
            {Object.keys(buttonMap[auth.user.role].navs).map((key) => (
              <li key={key} className="border-b-2 border-grey">
                {buttonMap[auth.user.role].buttons[key].path.icon}
                <button
                  onClick={() => {
                    navigate(buttonMap[auth.user.role].buttons[key].path);
                    props.setOpen(false);
                  }}
                >
                  {key}
                </button>
              </li>
            ))}
          </ul>
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
          // crossButtonClassName={""}
          overlayClassName={"opacity-25"}
          menuClassName={"bg-white px-4 pt-16 text-xl font-semibold"}
          // crossButtonClassName={"w-12 h-12"}
          burgerBarClassName={"bg-black"}
          burgerButtonClassName={"fixed top-12 left-12 z-50 w-12 h-8"}
        >
          <NavbarList setOpen={setOpen} />
        </Menu>
      </div>

      <div className="w-48 m-3 h-screen border-r-4 border-grey max-md:hidden">
        <NavbarList setOpen={setOpen} />
      </div>
    </>
  );
}
