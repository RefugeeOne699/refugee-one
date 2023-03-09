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
          navigate("/addJob");
        }}
      >
        Add Job
      </button>
      <button
        className="btn"
        onClick={() => {
          navigate("/adminDash");
        }}
      >
        Dashboard
      </button>

      <button
        className="btn"
        onClick={() => {
          navigate("/admin-jobpostings");
        }}
      >
        View Jobs (admin)
      </button>

      <button
        className="btn"
        onClick={() => {
          navigate("/employer-jobpostings");
        }}
      >
        View Jobs (employer)
      </button>
    </>
  );
}
