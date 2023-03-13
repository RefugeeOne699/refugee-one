import { useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";

import { useAuth } from "@/models";

import { slide as Menu } from "react-burger-menu";

import { userTypes, screenSize } from "@/utils/constants";

function NavbarList() {
  const navigate = useNavigate();
  const auth = useAuth();

  const userMap = {
    "Home": "/",
    "SignUp": "/signUp",
    "Add Job": "/addJob",
    "Dashboard": "/adminDash",
    "View Jobs (employer)": "/employer-jobpostings",
  };

  const adminMap = {
    "Home": "/",
    "SignUp": "/signUp",
    "Add Job": "/addJob",
    "Dashboard": "/adminDash",
    "View Jobs (admin)": "/admin-jobpostings",
    "View Jobs (employer)": "/employer-jobpostings",
  };

  const employerMap = {
    "Home": "/",
    "SignUp": "/signUp",
    "Add Job": "/addJob",
    "Dashboard": "/adminDash",
    "View Jobs (employer)": "/employer-jobpostings",
  };

  return (
    <>
      {auth.user?.role === userTypes[0] ? (
        // admin
        Object.keys(adminMap).map((key) => (
          <button
            className="btn w-full m-2"
            onClick={() => {
              navigate(adminMap[key]);
            }}
          >
            {key}
          </button>
        ))
      ) : auth.user?.role === userTypes[1] ? (
        // employer
        Object.keys(employerMap).map((key) => (
          <button
            className="btn w-full m-2"
            onClick={() => {
              navigate(employerMap[key]);
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
            onClick={() => {
              navigate(userMap[key]);
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
        width < screenSize.mobile ? (
          <Menu styles={styles}>
            <NavbarList />
          </Menu>
        ) : (
          <NavbarList />
        )
      }
    </>
  );
}
