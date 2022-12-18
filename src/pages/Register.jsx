import React from "react";

import { useModel } from "@/hooks";
import store from "@/store";

import { registerUser } from "../store/userData";
import RegisterView from "../views/RegisterView";

export default function Register() {
  const model = useModel();

  const onRegisterUser = (registerForm) => {
    return store.dispatch(registerUser(registerForm));
  };

  return <RegisterView onRegisterUser={onRegisterUser} userData={model.userData} />;
}
