import React from "react";

import { useModel } from "@/hooks";
import store from "@/store";
import { fetchRandomDrink } from "@/store/randomDrink";
import { addDrinkToList, removeDrinkFromList } from "@/store/userData";
import RandomView from "@/views/RandomView";

export default function Random() {
  const model = useModel();

  React.useEffect(() => {
    store.dispatch(fetchRandomDrink());
  }, []);

  return (
    <RandomView
      randomDrink={model.randomDrink}
      userData={model.userData}
      getNewRandomDrink={() => store.dispatch(fetchRandomDrink())}
      addDrinkToList={(drinkId) => store.dispatch(addDrinkToList(drinkId))}
      removeDrinkFromList={(drinkId) => store.dispatch(removeDrinkFromList(drinkId))}
    />
  );
}
