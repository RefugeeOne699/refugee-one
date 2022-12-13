import React, { useState } from "react";

import LoginView from "../views/LoginView";
import RegisterView from "../views/RegisterView";

export default function Login() {
  const [currentForm, setCurrentForm] = useState("login");
  const toggleForm = (formName) => {
    setCurrentForm(formName);
  };

  return (
    <div className="Login">
      {currentForm === "login" ? (
        <LoginView onFormSwitch={toggleForm} />
      ) : (
        <RegisterView onFormSwitch={toggleForm} />
      )}
    </div>
  );
}
