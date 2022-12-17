import { createSlice } from "@reduxjs/toolkit";

import cocktailDB from "../clients/cocktail";

export const initialState = {
  loading: false,
  error: false,
  data: [],
};

const searchDataSlice = createSlice({
  name: "searchData",
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

export function fetchSearchData(payload) {
  const query = payload;

  return async (dispatch) => {
    dispatch(setLoading());
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

export const { setLoading, setData, setError } = searchDataSlice.actions;

export default searchDataSlice.reducer;
