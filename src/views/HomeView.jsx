import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomeView(props) {
  const { onUserWantsToSearch } = props;
  const navigate = useNavigate();
  const [query, setQuery] = useState();

  return (
    <div className="flex-1 hero">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Hello there</h1>
          <p className="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi
            exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.
          </p>
          <div className="input-group justify-center">
            <input
              type="text"
              placeholder="Search…"
              className="input input-bordered w-full"
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn btn-square" onClick={() => onUserWantsToSearch(query)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
          <div className="pt-2 sm:pt-6">
            <button
              className="btn btn-primary mx-4 my-2 sm:my-0"
              onClick={() => navigate("/random")}
            >
              Random Cocktail
            </button>
            <button className="btn btn-primary mx-4 my-2 sm:my-0">
              Bartender Practice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
