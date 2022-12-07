import { configureStore } from "@reduxjs/toolkit";

import counterReducer from "./counter.js";
import randomDrinkReducer from "./randomDrink.js";

const store = configureStore({
  reducer: {
    counter: counterReducer,
    randomDrink: randomDrinkReducer,
  },
});

export default store;
