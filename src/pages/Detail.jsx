import { useEffect, useState } from "react";

import cocktail from "@/clients/cocktail";
import DetailView from "@/views/DetailView";

export default function Detail() {
  const [cocktailId, setCocktailId] = useState("11007");
  const [detailResult, setDetailResult] = useState({});
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    cocktail
      .get("lookup.php", {
        params: {
          i: cocktailId,
        },
      })
      .then((res) => {
        setDetailResult(res.data.drinks[0]);
        // console.log(res.data.drinks[0]);
        let ingreArray = addIngredients(res.data.drinks[0]);
        setIngredients([...ingreArray]);
      });
  }, [cocktailId]);

  function addIngredients(detailObject) {
    let ingredientsArray = [];
    for (let i in detailObject) {
      if (i.search("strIngredient") === 0 && detailObject[i] !== null)
        ingredientsArray.push(detailObject[i]);
    }
    return ingredientsArray;
  }

  return <DetailView detailResult={detailResult} ingredients={ingredients} />;
}
