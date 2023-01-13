import ReturnBtn from "./ReturnBtn";

export default function CocktailDetail(props) {
  const { drink, userData, onAddDrinkToList, onRemoveDrinkFromList, isDrinkInList } =
    props;
  const { data: drinkDetails, loading, error } = drink;

  if (error) return <div>Oops! Failed to fetch drink detail</div>;
  if (loading)
    return (
      <div>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif"
          alt="loading icon"
          className=""
        />
      </div>
    );
  if (!drinkDetails) return <div>Cannot find drink</div>;

  let ingredients = Object.entries(drinkDetails).filter(([key]) =>
    key.includes("strIngredient")
  );
  let measures = Object.entries(drinkDetails).filter(([key]) =>
    key.includes("strMeasure")
  );

  function renderIngredientList(ingredients, measures) {
    function ingredientTableRowCB(_element, index) {
      let ingredient = ingredients[index][1];
      let measure = measures[index][1] !== null ? measures[index][1] : "";
      if (ingredient === null) return;

      return (
        <tr key={index + ingredient + measure}>
          <th>{index + 1}</th>
          <td>{ingredient}</td>
          <td>{measure}</td>
        </tr>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th></th>
              <th>Ingredient</th>
              <th>Measure</th>
            </tr>
          </thead>
          <tbody>{ingredients.map(ingredientTableRowCB)}</tbody>
        </table>
      </div>
    );
  }

  function clickAddButton() {
    if (!userData?.user?.uid) {
      alert("Please login first, then you can add the cocktail to your favourite!");
    } else {
      onAddDrinkToList(drinkDetails.idDrink);
    }
  }

  return (
    <div className="detail-height mx-10 mt-1 card lg:card-side bg-base-100 shadow-xl">
      <figure>
        <img src={drinkDetails.strDrinkThumb} alt="Picture" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{drinkDetails.strDrink}</h2>
        <div>
          <span className="font-semibold">Category:</span>
          {drinkDetails.strCategory}
        </div>
        <div>
          <span className="font-semibold">Glass:</span>
          {drinkDetails.strGlass}
        </div>
        <div>
          <span className="font-semibold">Alcoholic:</span>
          {drinkDetails.strAlcoholic}
        </div>
        <div>
          <span className="font-semibold">Instructions:</span>
          {drinkDetails.strInstructions}
        </div>
        {/* <div>
          <span className="font-semibold">Ingredient:</span> {ingredients.join(", ")}
        </div> */}
        {renderIngredientList(ingredients, measures)}
        <div>
          {/* <button className="btn btn-primary">add to list</button> */}
          {isDrinkInList ? (
            <button
              className="btn btn-error"
              onClick={() => onRemoveDrinkFromList(drinkDetails.idDrink)}
            >
              Remove from list
            </button>
          ) : (
            <button className="btn btn-primary" onClick={clickAddButton}>
              Add to my favorite
            </button>
          )}
          <span className="ml-4">{<ReturnBtn />}</span>
        </div>
      </div>
    </div>
  );
}
