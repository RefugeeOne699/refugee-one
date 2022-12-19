import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomeView(props) {
  const { onUserWantsToSearch } = props;
  const navigate = useNavigate();
  const [query, setQuery] = useState();

  function handleKeyDown(e) {
    if (e.key === "Enter") onUserWantsToSearch(query);
  }

  return (
    <div className="flex-1 hero">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">
            Looking for inspiration for a drink or practice your bartender skills?
          </h1>
          <p className="py-6">
            Get a random drink recipe for the weekend to celebrate with friends and
            family, or improve your bartender skills by practicing drink recipes.
          </p>
          <div className="input-group justify-center">
            <input
              type="text"
              placeholder="Vodka Martini"
              className="input input-bordered w-full"
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
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
            <button
              className="btn btn-primary mx-4 my-2 sm:my-0"
              onClick={() => navigate("/popular")}
            >
              Explore Popular
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
