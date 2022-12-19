import React from "react";

import { useModel } from "@/hooks";
import store from "@/store";
import { fetchPopularDrinks } from "@/store/popularDrinks";
import PopularDrinkView from "@/views/PopularDrinkView";

export default function Popular() {
  const model = useModel();

  React.useEffect(() => {
    if (model.popularDrinks.data && model.popularDrinks.data.length !== 0) return; //Only need to fetch if there is no data
    store.dispatch(fetchPopularDrinks());
  }, []);

  return <PopularDrinkView popularDrinks={model.popularDrinks} />;
}
