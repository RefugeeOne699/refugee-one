import React from "react";

import { useModel } from "@/hooks";
import store from "@/store";
import RandomView from "@/views/RandomView";

import { fetchRandomDrink } from "../store/randomDrink";

export default function Random() {
  const model = useModel();

  React.useEffect(() => {
    store.dispatch(fetchRandomDrink());
  }, []);

  return (
    <RandomView
      randomDrink={model.randomDrink}
      getNewRandomDrink={() => store.dispatch(fetchRandomDrink())}
    />
  );
}
