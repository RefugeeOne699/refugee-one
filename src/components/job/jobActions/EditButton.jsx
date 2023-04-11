import { Link, useLocation } from "react-router-dom";

export default function EditButton({ jobId }) {
  const location = useLocation();
  return (
    <Link to={`/updateJob/${jobId}`} state={{ from: location.pathname }}>
      <button className="btn btn-primary w-32">Edit</button>
    </Link>
  );
}
