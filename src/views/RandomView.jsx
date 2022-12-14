export default function RandomView(props) {
  function renderDrink(drink) {
    if (drink.loading) {
      return <h1>Loading...</h1>;
    }
    if (drink.error) {
      return <h1>Error</h1>;
    }
    if (drink.data.length === 0) {
      return;
    }

    let drinkDetails = drink.data.drinks[0];
    let ingredients = Object.entries(drinkDetails).filter(([key]) =>
      key.includes("strIngredient")
    );
    let measures = Object.entries(drinkDetails).filter(([key]) =>
      key.includes("strMeasure")
    );

    return (
      <>
        <img
          src={drinkDetails.strDrinkThumb}
          className="max-w-sm rounded-lg shadow-2xl"
        />
        <div>
          <h1 className="text-5xl font-bold">{drinkDetails.strDrink}</h1>
          <h2 className="text-2xl font-bold pt-5">Instructions:</h2>
          <p className="pb-2">{drinkDetails.strInstructions}</p>
          {renderIngredientList(ingredients, measures)}
        </div>
      </>
    );
  }

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
    <div className="flex-1 bg-base-200 grid place-content-center">
      <div className="flex justify-center py-5">
        <button className="btn btn-primary" onClick={() => props.getNewRandomDrink()}>
          Press me for new random drink!
        </button>
      </div>
      <div className="hero">
        <div className="hero-content flex-col lg:flex-row">
          {renderDrink(props.randomDrink)}
        </div>
      </div>
    </div>
  );
}
