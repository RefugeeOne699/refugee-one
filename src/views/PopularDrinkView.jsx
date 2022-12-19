import { useNavigate } from "react-router-dom";

import ReturnBtn from "@/components/ReturnBtn";

export default function PopularDrinkView(props) {
  const { popularDrinks } = props;

  const navigate = useNavigate();

  function renderPopularDrinks() {
    if (popularDrinks.loading)
      return (
        <div>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif"
            alt="loading icon"
            className=""
          />
        </div>
      );
    if (popularDrinks.error) return <h1>Error</h1>;
    if (!popularDrinks.data) return;
    if (popularDrinks.data.length === 0) return;

    function renderDrinkCard(cocktail) {
      const clickCocktail = (cocktail) => {
        navigate(`/detail/${cocktail.idDrink}`);
      };

      return (
        <div
          key={cocktail.idDrink}
          className="w-52 h-64 m-5 bg-base-100 shadow-xl rounded-xl hover:bg-base-300 hover:cursor-pointer"
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
    return popularDrinks.data.drinks.map(renderDrinkCard);
  }

  return (
    <div>
      <div className="flex justify-center pt-20 pb-14">
        <h1 className="text-4xl font-bold">Popular Cocktails</h1>
        <span className="ml-4">{<ReturnBtn />}</span>
      </div>
      <div className="flex justify-center">
        <div className="flex flex-wrap max-w-screen-xl justify-center">
          {renderPopularDrinks()}
        </div>
      </div>
    </div>
  );
}
