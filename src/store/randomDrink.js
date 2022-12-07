import { createSlice } from "@reduxjs/toolkit";

import instance from "../clients/cocktail";

export const initialState = {
  loading: false,
  error: false,
  data: [],
};

const randomDrinkSlice = createSlice({
  name: "randomDrink",
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

export function fetchRandomDrink() {
  return async (dispatch) => {
    dispatch(setLoading());
    instance
      .get("/random.php")
      .then((response) => {
        dispatch(setData(response.data));
      })
      .catch((error) => {
        dispatch(setError(error));
      });
  };
}

export const { setLoading, setData, setError } = randomDrinkSlice.actions;

export default randomDrinkSlice.reducer;
