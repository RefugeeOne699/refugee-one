import React from "react";

import UserForm from "@/components/UserForm";

export default function Register(props) {
  const { onRegisterUser, userData } = props;

  const { register: registerReq } = userData;

  return (
    <UserForm
      btnText="Register"
      titleText="Register"
      displayHelp={true}
      onSubmit={onRegisterUser}
      loading={registerReq.loading}
    />
  );
}
