import React, { useState } from "react";

import LoginView from "../views/LoginView";
import RegisterView from "../views/RegisterView";

export default function Register() {
  const [currentForm, setCurrentForm] = useState("register");
  const toggleForm = (formName) => {
    setCurrentForm(formName);
  };

  return (
    <div className="Register">
      {currentForm === "register" ? (
        <RegisterView onFormSwitch={toggleForm} />
      ) : (
        <LoginView onFormSwitch={toggleForm} />
      )}
    </div>
  );
}
