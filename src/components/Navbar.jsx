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
    <>
      {auth.user?.role === ROLES.ADMIN ? (
        // admin
        Object.keys(adminMap).map((key) => (
          <button
            className="btn w-full m-2"
            key={key}
            onClick={() => {
              navigate(adminMap[key]);
              props.setOpen(false);
            }}
          >
            {key}
          </button>
        ))
      ) : auth.user?.role === ROLES.EMPLOYER ? (
        // employer
        Object.keys(employerMap).map((key) => (
          <button
            className="btn w-full m-2"
            key={key}
            onClick={() => {
              navigate(employerMap[key]);
              props.setOpen(false);
            }}
          >
            {key}
          </button>
        ))
      ) : (
        // user
        Object.keys(userMap).map((key) => (
          <button
            className="btn w-full m-2"
            key={key}
            onClick={() => {
              navigate(userMap[key]);
              props.setOpen(false);
            }}
          >
            {key}
          </button>
        ))
      )}
    </>
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
      background: '#FFFFFF'
    },
    bmBurgerBarsHover: {
      background: '#a90000'
    },
    bmCrossButton: {
      height: '24px',
      width: '24px'
    },
    bmCross: {
      background: '#bdc3c7'
    },
    bmMenuWrap: {
      position: 'fixed',
      height: '100%'
    },
    bmMenu: {
      background: '#373a47',
      padding: '2.5em 1.5em 0',
      fontSize: '1.15em'
    },
    bmMorphShape: {
      fill: '#373a47'
    },
    bmItemList: {
      color: '#b8b7ad',
      padding: '0.8em',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'start',
    },
    bmItem: {
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
