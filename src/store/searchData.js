import { createSlice } from "@reduxjs/toolkit";

import cocktailDB from "../clients/cocktail";

export const initialState = {
  loading: false,
  error: false,
  query: "",
  data: [],
};

const searchDataSlice = createSlice({
  name: "searchData",
  initialState,
  reducers: {
    startFetch: (state) => {
      state.loading = true;
      state.error = false;
      state.data = [];
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

export function fetchSearchData(payload) {
  const query = payload;

  return async (dispatch) => {
    dispatch(startFetch());
    cocktailDB
      .get("search.php", {
        params: {
          s: query,
        },
      })
      .then((response) => {
        dispatch(setData(response?.data?.drinks));
      })
      .catch((error) => {
        dispatch(setError(error));
      });
  };
}

export const { startFetch, setData, setError } = searchDataSlice.actions;

export default searchDataSlice.reducer;
