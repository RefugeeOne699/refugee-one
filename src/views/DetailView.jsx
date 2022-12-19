import ReturnBtn from "@/components/ReturnBtn";
import { useEffect, useState } from "react";

export default function DetailView(props) {
  const { drinkDetail, userData, onAddDrinkToList, onRemoveDrinkFromList } = props;
  const { data: detailResult, loading, error } = drinkDetail;
  const [ingredients, setIngredients] = useState([]);
  const [measures, setMeasures] = useState([]);
  const drinkList = userData.drinkList ?? [];
  const isDrinkInList = drinkList.includes(detailResult?.idDrink);

  useEffect(() => {
    if (!detailResult) return;
    const ingredientsArray = Object.entries(detailResult).filter(([key]) =>
      key.includes("strIngredient")
    );
    setIngredients(ingredientsArray);
    const measuresArray = Object.entries(detailResult).filter(([key]) =>
      key.includes("strMeasure")
    );
    setMeasures(measuresArray);
  }, [detailResult]);

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
  if (!detailResult) return <div>Cannot find drink</div>;

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
    <div className="detail-height mx-10 mt-1 card lg:card-side bg-base-100 shadow-xl">
      <figure>
        <img src={detailResult.strDrinkThumb} alt="Picture" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{detailResult.strDrink}</h2>
        <div>
          <span className="font-semibold">Category:</span>
          {detailResult.strCategory}
        </div>
        <div>
          <span className="font-semibold">Glass:</span>
          {detailResult.strGlass}
        </div>
        <div>
          <span className="font-semibold">Alcoholic:</span>
          {detailResult.strAlcoholic}
        </div>
        <div>
          <span className="font-semibold">Instructions:</span>
          {detailResult.strInstructions}
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
              onClick={() => onRemoveDrinkFromList(detailResult.idDrink)}
            >
              Remove from list
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => onAddDrinkToList(detailResult.idDrink)}
            >
              Add to my favorite
            </button>
          )}
          <span className="ml-4">{<ReturnBtn />}</span>
        </div>
      </div>
    </div>
  );
}
