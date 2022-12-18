import { createSlice } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { onValue, ref, set } from "firebase/database";

import database, { auth } from "@/clients/firebase";

export const initialState = {
  user: null,
  drinkList: [],
  register: {
    loading: false,
    error: false,
    errorCode: null,
  },
  login: {
    loading: false,
    error: false,
    errorCode: null,
  },
};

const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload;
    },
    setDrinkList: (state, { payload }) => {
      state.drinkList = payload;
    },
    setRegisterLoading: (state, { payload }) => {
      state.register.loading = payload;
    },
    setRegisterError: (state, { payload }) => {
      state.register = {
        ...state.register,
        error: payload.error,
        errorCode: payload.errorCode,
      };
    },
    setLoginLoading: (state, { payload }) => {
      state.login.loading = payload;
    },
    setLoginError: (state, { payload }) => {
      state.login = {
        ...state.login,
        error: payload.error,
        errorCode: payload.errorCode,
      };
    },
  },
});

export function registerUser(payload) {
  const { email, password } = payload;

  return async (dispatch) => {
    dispatch(setRegisterLoading(true)); // Start loading
    dispatch(
      setRegisterError({
        error: false,
        errorCode: null,
      })
    ); // Clear error
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // const user = userCredential.user;
        // dispatch(setUser(user));
      })
      .catch((error) => {
        const errorCode = error.code;
        dispatch(
          setRegisterError({
            error: true,
            errorCode: errorCode,
          })
        );
      })
      .finally(() => {
        dispatch(setRegisterLoading(false)); // Finally set loading to false
      });
  };
}

export function loginUser(payload) {
  const { email, password } = payload;

  return async (dispatch) => {
    dispatch(setLoginLoading(true)); // Start loading
    dispatch(
      setLoginError({
        error: false,
        errorCode: null,
      })
    ); // Clear error
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // const user = userCredential.user;
        // dispatch(setUser(user));
      })
      .catch((error) => {
        const errorCode = error.code;
        dispatch(
          setLoginError({
            error: true,
            errorCode: errorCode,
          })
        );
        throw new Error(error);
      })
      .finally(() => {
        dispatch(setLoginLoading(false)); // Finally set loading to false
      });
  };
}

export function logoutUser() {
  return async (dispatch) => {
    signOut(auth)
      .then(() => {
        // dispatch(setUser(null));
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

export function addDrinkToList(payload) {
  const id = payload;

  return async (dispatch, getState) => {
    const state = getState();
    const uid = state?.userData?.user?.uid;
    if (!uid) return;
    set(ref(database, `userData/${uid}/drinkList/${id}`), Date.now()).catch((error) => {
      console.log(error);
    });
  };
}

export function removeDrinkFromList(payload) {
  const id = payload;

  return async (dispatch, getState) => {
    const state = getState();
    const uid = state?.userData?.user?.uid;
    if (!uid) return;
    set(ref(database, `userData/${uid}/drinkList/${id}`), null).catch((error) => {
      console.log(error);
    });
  };
}

export function initUserData() {
  return async (dispatch, getState) => {
    const state = getState();
    const uid = state?.userData?.user?.uid;

    if (!uid) return;

    onValue(ref(database, `userData/${uid}/drinkList`), (snapshot) => {
      const data = snapshot.val();
      if (data) dispatch(setDrinkList(Object.keys(data)));
    });
  };
}

export const {
  setUser,
  setRegisterLoading,
  setRegisterError,
  setLoginLoading,
  setLoginError,
  setDrinkList,
} = userDataSlice.actions;

export default userDataSlice.reducer;
