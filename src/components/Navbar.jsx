import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <>
      <button
        className="btn"
        onClick={() => {
          navigate("/");
        }}
      >
        Home
      </button>
      <button
        className="btn"
        onClick={() => {
          navigate("/signUp");
        }}
      >
        SignUp
      </button>
      <button
        className="btn"
        onClick={() => {
          navigate("/profile");
        }}
      >
        Profile
      </button>
      <button
        className="btn"
        onClick={() => {
          navigate("/addJob");
        }}
      >
        Add Job
      </button>
      <button
        className="btn"
        onClick={() => {
          navigate("/admin");
        }}
      >
        Dashboard
      </button>

      <button
        className="btn"
        onClick={() => {
          navigate("/admin/pendingJobs");
        }}
      >
        View Jobs (admin)
      </button>

      <button
        className="btn"
        onClick={() => {
          navigate("/employer/jobs");
        }}
      >
        View Jobs (employer)
      </button>
    </>
  );
}
