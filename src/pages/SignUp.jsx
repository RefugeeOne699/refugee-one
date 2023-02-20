import { useRequest } from "ahooks";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/models";

export default function SignUp() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  // follow this function for a better practice with interactive button

  const { run: signUp, loading: signUpLoading } = useRequest(
    async (data) => auth.signUp(data),
    {
      manual: true,
      onSuccess: () => {
        navigate("/");
      },
      onError: (error) => {
        //todo: handle error
        console.error(error);
      },
    }
  );

  if (auth.user) {
    console.log(auth.user);
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <p className="text-xl">Note: this is a temporary sign up place</p>
      <form onSubmit={handleSubmit(signUp)}>
        <label className="label" htmlFor="name">
          <span className="label-text">Full Name</span>
        </label>
        <input
          {...register("name", { required: true })}
          type="text"
          className="input w-full max-w-xs input-bordered mb-4"
        />
        <label className="label" htmlFor="email">
          <span className="label-text">Email</span>
        </label>
        <input
          {...register("email", { required: true })}
          type="email"
          className="input w-full max-w-xs input-bordered mb-4"
        />
        <label className="label" htmlFor="password">
          <span className="label-text">Password</span>
        </label>
        <input
          {...register("password", { required: true })}
          type="password"
          className="input w-full max-w-xs input-bordered mb-4"
        />
        <label className="label" htmlFor="phone">
          <span className="label-text">Phone</span>
        </label>
        <input
          {...register("phone", { required: true })}
          type="number"
          className="input w-full max-w-xs input-bordered mb-4"
        />
        <button
          type="submit"
          className={`btn btn-primary ${signUpLoading ? "loading" : ""}`}
          disabled={signUpLoading}
        >
          {signUpLoading ? "Loading" : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
