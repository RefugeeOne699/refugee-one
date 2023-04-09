import { useNavigate } from "react-router-dom";

export default function JobEditRemove({ jobId, status }) {
  const navigate = useNavigate();
  return (
    <>
      <div className="items-center text-center w-3/4">
        <div className="w-full flex flex-row justify-center">
          <button
            className={`btn btn-primary ${
              status === "approved" ? "btn-outline" : ""
            } ml-5 `}
            onClick={() => navigate("../../../../addJob", { state: { jobId: jobId } })}
          >
            Edit job
          </button>
          <button
            className={`btn btn-primary ml-5 ${status === "approved" ? "" : "hidden"}`}
          >
            Remove Job Post
          </button>
        </div>
      </div>
    </>
  );
}
