import { configureStore } from "@reduxjs/toolkit";

import counterReducer from "./counter.js";
import randomDrinkReducer from "./randomDrink.js";
import userDataReducer from "./userData.js";

const store = configureStore({
  reducer: {
    counter: counterReducer,
    randomDrink: randomDrinkReducer,
    userData: userDataReducer,
  },
});

export default store;
