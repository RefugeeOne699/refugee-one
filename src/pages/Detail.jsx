import { useEffect, useState } from "react";

import cocktail from "@/clients/cocktail";
import { useModel } from "@/hooks";
import DetailView from "@/views/DetailView";

export default function Detail() {
  const model = useModel();
  // console.log(model.detailData.id);

  // const [cocktailId, setCocktailId] = useState("11007");
  const [detailResult, setDetailResult] = useState({});
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    cocktail
      .get("lookup.php", {
        params: {
          i: model.detailData.id,
        },
      })
      .then((res) => {
        setDetailResult(res.data.drinks[0]);
        // console.log(res.data.drinks[0]);
        // let ingreArray = addIngredients(res.data.drinks[0]);
        setIngredients(addIngredients(res.data.drinks[0]));
      });
  }, []);

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
