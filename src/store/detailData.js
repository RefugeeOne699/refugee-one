import { createSlice } from "@reduxjs/toolkit";

// import cocktailDB from "../clients/cocktail";

export const initialState = {
  //   loading: false,
  //   error: false,
  id: "",
};

const detailDataSlice = createSlice({
  name: "detailData",
  initialState,
  reducers: {
    /* setLoading: (state) => {
      state.loading = true;
    },
    setData: (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.data = payload;
    },
    setError: (state) => {
      state.error = true;
    }, */
    setId: (state, { payload }) => {
      state.id = payload;
    },
  },
});

/* export function fetchSearchData(payload) {
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
} */

export function getDrinkId(payload) {
  const id = payload;

  return async (dispatch) => {
    dispatch(setId(id));
    /* cocktailDB
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
        }); */
  };
}

// export const { setLoading, setId, setError } = detailDataSlice.actions;
export const { setId } = detailDataSlice.actions;

export default detailDataSlice.reducer;
