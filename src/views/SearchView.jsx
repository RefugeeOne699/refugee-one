export default function SearchView(props) {
  const { searchResult } = props;

  function renderResult(cocktail) {
    return (
      <div
        key={cocktail.idDrink}
        className="w-52 h-64 m-5 bg-base-100 shadow-xl rounded-xl"
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
    <div className="h-96 px-20 py-10 mx-20 my-10 border-2 overflow-auto flex flex-row flex-wrap">
      {searchResult.map(renderResult)}
    </div>
  );
}
