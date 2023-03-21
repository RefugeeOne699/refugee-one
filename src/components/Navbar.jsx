import { useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";

import { useAuth } from "@/models";

import { slide as Menu } from "react-burger-menu";

import { ROLES, SCREEN_SIZE } from "@/constants";

function NavbarList(props) {
  const navigate = useNavigate();
  const auth = useAuth();

  const userMap = {
    "Home": "/",
    "Profile": "/profile",
    "SignUp": "/signUp",
    "Add Job": "/addJob",
  };

  const adminMap = {
    "Home": "/",
    "Profile": "/profile",
    "SignUp": "/signUp",
    "Add Job": "/addJob",
    "Dashboard": "/admin",
    "View Jobs (admin)": "/admin/pendingJobs",
  };

  const employerMap = {
    "Home": "/",
    "Profile": "/profile",
    "SignUp": "/signUp",
    "Add Job": "/addJob",
    "View Jobs (employer)": "/employer/jobs",
  };

  return (
    <ul className="menu w-56 p-2 gap-5 text-black">
      {auth.user?.role === ROLES.ADMIN ? (
        // admin
        Object.keys(adminMap).map((key) => (
          <li className="border-b-2 border-grey">
            <button
              className=""
              key={key}
              onClick={() => {
                navigate(adminMap[key]);
                props.setOpen(false);
              }}
            >
              {key}
            </button>
          </li>
        ))
      ) : auth.user?.role === ROLES.EMPLOYER ? (
        // employer
        Object.keys(employerMap).map((key) => (
          <li className="border-b-2 border-grey">
            <button
              className=""
              key={key}
              onClick={() => {
                navigate(employerMap[key]);
                props.setOpen(false);
              }}
            >
              {key}
            </button>
          </li>
        ))
      ) : (
        // user
        Object.keys(userMap).map((key) => (
          <li className="border-b-2 border-grey">
            <button
              className=""
              key={key}
              onClick={() => {
                navigate(userMap[key]);
                props.setOpen(false);
              }}
            >
              {key}
            </button>
          </li>
        ))
      )}
    </ul>
  );
}

export default function Navbar() {
  const [width, setWidth] = useState(window.innerWidth);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
  })

  var styles = {
    bmBurgerButton: {
      position: 'fixed',
      width: '36px',
      height: '30px',
      left: '36px',
      top: '36px',
    },
    bmBurgerBars: {
      background: 'black'
    },
    bmBurgerBarsHover: {
      background: '#a90000'
    },
    bmCrossButton: {
      height: '24px',
      width: '24px'
    },
    bmCross: {
      background: 'black'
    },
    bmMenu: {
      background: 'white',
      padding: '2.5em 1.5em 0',
      fontSize: '1.15em'
    },
    bmOverlay: {
      background: 'rgba(0, 0, 0, 0.3)'
    }
  }

  return (
    <>
      {
        width < SCREEN_SIZE.MOBILE ? (
          <Menu styles={styles} 
            isOpen={open}
            onStateChange={(state) => setOpen(state.isOpen)}
          >
            <NavbarList 
              setOpen={setOpen}
            />
          </Menu>
        ) : (
          <div className="w-48 m-3 h-full">
            <NavbarList 
              setOpen={setOpen}
            />
          </div>
        )
      }
    </>
  );
}
