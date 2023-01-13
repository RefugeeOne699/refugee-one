import { useNavigate } from "react-router-dom";

export default function ReturnBtn() {
  const navigate = useNavigate();

  return (
    <button className="btn btn-primary" onClick={() => navigate(-1)}>
      Return
    </button>
  );
}
