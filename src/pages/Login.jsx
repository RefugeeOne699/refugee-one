import React from "react";

import { useModel } from "@/hooks";
import store from "@/store";

import { loginUser } from "../store/userData";
import LoginView from "../views/LoginView";

export default function Login() {
  const model = useModel();

  const onLoginUser = async (loginForm) => {
    return store.dispatch(loginUser(loginForm));
  };

  return <LoginView onLoginUser={onLoginUser} userData={model.userData} />;
}
