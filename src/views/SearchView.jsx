import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchView(props) {
  const { searchData, onUserWantsToSearch } = props;
  const { data: searchResult, loading, error } = searchData;
  const navigate = useNavigate();

  const [query, setQuery] = useState();

  function handleKeyDown(e) {
    if (e.key === "Enter") onUserWantsToSearch(query);
  }

  function renderResult(cocktail) {
    const clickCocktail = (cocktail) => {
      navigate(`/detail/${cocktail.idDrink}`);
    };

    return (
      <div
        key={cocktail.idDrink}
        className="w-52 h-64 m-5 bg-base-200 shadow-xl rounded-xl hover:bg-base-300 hover:cursor-pointer"
        onClick={() => {
          clickCocktail(cocktail);
        }}
      >
        <figure className="px-5 pt-5">
          <img
            src={cocktail.strDrinkThumb}
            // alt={cocktail.strImageAttribution}
            className="rounded-xl w-40 mx-auto"
          />
        </figure>
        <div className="py-5 items-center text-center">
          <h2 className="search-name">{cocktail.strDrink}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="form-control pt-20 pb-14">
        <div className="input-group justify-center">
          <input
            type="text"
            placeholder="Search…"
            className="input input-bordered w-80"
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
      </div>
      <div className="flex justify-center">
        {searchResult === null ? (
          <div>{"Sorry! Can't find any cocktail."}</div>
        ) : (
          <div className="flex flex-wrap max-w-screen-xl">
            {searchResult.map(renderResult)}
          </div>
        )}
      </div>
    </div>
  );
}
