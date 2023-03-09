export function JobView({ job }) {
  return job ? (
    <div className="flex items-center justify-center bg-base-300 w-100">
      <div className="card h-fit w-9/12 bg-base-100">
        <h2 className="card-title">{job.title}</h2>
        <div className="card-body">
          <div className="card bg-base-100">
            <h2 className="card-title">Basic Info</h2>
            <div className="card-body">
              <ul>
                <li key={1}>
                  <strong>English Level: </strong>
                  {job.englishLevel}
                </li>
                <li key={2}>
                  <strong>Minimum Wage: </strong>
                  {job.minWage}
                </li>
                <li key={24}>
                  <strong>Maximum Wage: </strong>
                  {job.maxWage}
                </li>
                <li key={21}>
                  <strong>Location </strong>
                  {job.location}
                </li>
                <li key={3}>
                  <strong>Post Date: </strong>
                  {`${new Date(job.dateInput.seconds * 1000)}`}
                </li>
                <li key={10}>
                  <strong>Description: </strong>
                  {job.description}
                </li>
              </ul>
            </div>
          </div>
          <div className="card bg-base-100">
            <h2 className="card-title">Poster Company:</h2>
            <div className="card-body">
              <ul>
                <li key={1}>
                  <strong>Name: </strong>
                  {job.parsedCompany.name}
                </li>
              </ul>
            </div>
          </div>
          <div className="card bg-base-100">
            <h2 className="card-title">Poster:</h2>
            <div className="card-body">
              <ul>
                <li key={2}>
                  <strong>Name: </strong>
                  {job.parsedOwner.name}
                </li>
                <li key={204}>
                  <strong>Email: </strong>
                  {job.parsedOwner.email}
                </li>
                <li key={24}>
                  <strong>Phone: </strong>
                  {job.parsedOwner.phone}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}
