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
    </>
  );
}
