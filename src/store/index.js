import { configureStore } from "@reduxjs/toolkit";

import counterReducer from "./counter.js";
import detailDataReducer from "./detailData.js";
import randomDrinkReducer from "./randomDrink.js";
import searchDataReducer from "./searchData.js";
import userDataReducer from "./userData.js";

const store = configureStore({
  reducer: {
    counter: counterReducer,
    randomDrink: randomDrinkReducer,
    searchData: searchDataReducer,
    detailData: detailDataReducer,
    userData: userDataReducer,
  },
});

export default store;
