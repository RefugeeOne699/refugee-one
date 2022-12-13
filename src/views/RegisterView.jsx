import React, { useState } from "react";

export default function Register(props) {
  const [email, setEmail] = useState("");
  const [pass, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email);
  };

  return (
    <div className="auth-form-container">
      <h2>Register</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <label htmlFor="first name">First name</label>
        <input
          value={firstName}
          name="firstname"
          onChange={(e) => setFirstName(e.target.value)}
          id="firstname"
          placeholder="ex. Anders"
        />
        <label htmlFor="last name">Last name</label>
        <input
          value={lastName}
          name="lastname"
          onChange={(e) => setLastName(e.target.value)}
          id="lastname"
          placeholder="ex. Andersson"
        />
        <label htmlFor="email">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="ex. Anders@kth.se"
          id="email"
          name="email"
        />
        <label htmlFor="password">Password</label>
        <input
          value={pass}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="********"
          id="password"
          name="password"
        />
        <button type="submit">Register</button>
      </form>
      <button className="link-btn" onClick={() => props.onFormSwitch("login")}>
        Already have an account? Login here.
      </button>
    </div>
  );
}
