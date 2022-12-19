import { Link, useNavigate } from "react-router-dom";

export default function Navbar(props) {
  const { userData, signOut } = props;
  const navigate = useNavigate();

  return (
    <div className="navbar bg-base-100 border-b">
      <div className="navbar-start">
        <a className="btn btn-ghost normal-case text-xl" onClick={() => navigate("/")}>
          <img src="/favicon-32x32.png" />
          <h1 className="hidden sm:block pl-2">Bartender CheatSheet</h1>
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        {/*use this div for items in middle of navbar*/}
      </div>
      <div className="navbar-end">
        {userData?.user?.uid ? (
          <div className="dropdown dropdown-end dropdown-hover">
            <label tabIndex={0}>
              {userData.user.email}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="w-4 h-4 ml-1 inline"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link to="/my-list">My Drink List</Link>
              </li>
              <li>
                <a onClick={signOut}>Sign Out</a>
              </li>
            </ul>
          </div>
        ) : (
          <Link className="btn" to="/login">
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}
