export default function JobEditRemove({ status }) {
  return (
    <>
      <div className="items-center text-center w-3/4">
        <div className="w-full flex flex-row justify-center">
          <button
            className={`btn btn-primary btn-outline ml-5 ${
              status === "pending" || status === "approved" ? "" : "hidden"
            }`}
          >
            Edit job
          </button>
          <button
            className={`btn btn-primary ml-5 ${status === "pending" ? "hidden" : ""}`}
          >
            Remove Job Post
          </button>
        </div>
      </div>
    </>
  );
}
