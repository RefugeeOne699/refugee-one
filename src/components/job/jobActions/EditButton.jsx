import { Link, useLocation } from "react-router-dom";

export default function EditButton({ jobId, disabled }) {
  const location = useLocation();
  const button = (
    <button className="btn btn-primary w-32" disabled={disabled}>
      Edit
    </button>
  );
  if (disabled) {
    return button;
  }
  return (
    <Link to={`/updateJob/${jobId}`} state={{ from: location.pathname }}>
      {button}
    </Link>
  );
}
