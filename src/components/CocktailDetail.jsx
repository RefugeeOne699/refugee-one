export default function CocktailDetail(props) {
  const { drink, onAddDrinkToList, onRemoveDrinkFromList, isDrinkInList } = props;
  if (drink.loading) {
    return <h1>Loading...</h1>;
  }
  if (drink.error) {
    return <h1>Error</h1>;
  }
  if (!drink) {
    return;
  }

  let drinkDetails = drink.data;
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

  return (
    <>
      <img src={drinkDetails.strDrinkThumb} className="max-w-sm rounded-lg shadow-2xl" />
      <div>
        <h1 className="text-5xl font-bold py-2">{drinkDetails.strDrink}</h1>
        <div className="py-2">
          {isDrinkInList ? (
            <button
              className="btn btn-error"
              onClick={() => onRemoveDrinkFromList(drinkDetails.idDrink)}
            >
              Remove from list
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => onAddDrinkToList(drinkDetails.idDrink)}
            >
              Add to my favorite
            </button>
          )}
        </div>
        <div className="py-2">
          <h2 className="text-2xl font-bold">Instructions:</h2>
          <p>{drinkDetails.strInstructions}</p>
        </div>
        {renderIngredientList(ingredients, measures)}
      </div>
    </>
  );
}
