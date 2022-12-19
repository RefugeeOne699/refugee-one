import { createSlice } from "@reduxjs/toolkit";

import cocktailDB from "../clients/cocktail";

export const initialState = {
  loading: false,
  error: false,
  data: [],
};

const popularDrinksSlice = createSlice({
  name: "popularDrinks",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    setData: (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.data = payload;
    },
    setError: (state) => {
      state.error = true;
    },
  },
});

export function fetchPopularDrinks() {
  return async (dispatch) => {
    dispatch(setLoading());
    cocktailDB
      .get("/popular.php")
      .then((response) => {
        dispatch(setData(response?.data));
      })
      .catch((error) => {
        dispatch(setError(error));
      });
  };
}

export const { setLoading, setData, setError } = popularDrinksSlice.actions;

export default popularDrinksSlice.reducer;
