import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function UserForm(props) {
  const { onSubmit, loading, titleText, btnText, displayHelp } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    onSubmit({
      email,
      password,
    })
      .then(() => navigate("/"))
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-4xl font-semibold mt-16">{titleText}</h1>

      <div className="form-control w-full max-w-xs mt-6">
        <label className="label" htmlFor="email">
          <span className="label-text">Email</span>
        </label>
        <input
          type="email"
          name="email"
          placeholder="example@kth.se"
          className="input input-bordered w-full max-w-xs mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="label" htmlFor="password">
          <span className="label-text">Password</span>
        </label>
        <input
          type="password"
          name="password"
          className="input input-bordered w-full max-w-xs mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className={loading ? "btn loading" : "btn"}
          disabled={loading}
          onClick={handleSubmit}
        >
          {btnText}
        </button>
      </div>

      {displayHelp ? (
        <Link className="btn-link mt-2" to="/login">
          Already have an account? Login here.
        </Link>
      ) : null}
    </div>
  );
}
