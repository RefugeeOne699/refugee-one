import React from "react";

import UserForm from "@/components/UserForm";

export default function Login(props) {
  const { onLoginUser, userData } = props;

  const { login: loginReq } = userData;

  return (
    <UserForm
      btnText="Login"
      titleText="Login"
      displayHelp={false}
      onSubmit={onLoginUser}
      loading={loginReq.loading}
    />
  );
}
