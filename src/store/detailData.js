import { createSlice } from "@reduxjs/toolkit";

import cocktailDB from "../clients/cocktail";

export const initialState = {
  loading: false,
  error: null,
  data: null,
};

const detailDataSlice = createSlice({
  name: "detailData",
  initialState,
  reducers: {
    startFetch: (state) => {
      state.loading = true;
      state.error = false;
      state.data = null;
    },
    setData: (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.data = payload;
    },
    setError: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
  },
});

export function fetchDrinkDetail(payload) {
  const id = payload;

  return async (dispatch) => {
    dispatch(startFetch());
    cocktailDB
      .get("lookup.php", {
        params: {
          i: id,
        },
      })
      .then((res) => {
        dispatch(setData(res?.data?.drinks?.[0]));
      })
      .catch((err) => dispatch(setError(err)));
  };
}

export const { startFetch, setError, setData } = detailDataSlice.actions;

export default detailDataSlice.reducer;
