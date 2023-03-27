import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { useRequest } from "ahooks";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

import { useAuth } from "@/models";

export default function Home() {
  const auth = useAuth();
  const { register, handleSubmit } = useForm();
  // follow this function for a better practice with interactive button
  const { run: signIn, loading: signInLoading } = useRequest(
    async (data) => auth.signIn(data),
    {
      manual: true,
      onSuccess: () => {
        toast.success("Sign in succeeded");
      },
      onError: (error) => {
        if (
          error.code === "auth/wrong-password" ||
          error.code === "auth/user-not-found"
        ) {
          toast.error("Failed: Email and password does not match");
        }
      },
    }
  );

  const { run: signOut } = useRequest(async () => auth.signOut(), {
    manual: true,
    onError: (error) => {
      //todo: handle error
      console.error(error);
    },
  });

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="card max-w-md">
        <div className="card-body">
          <p className="mb-5 text-3xl">Login To RefugeeOne Job Search Portal</p>
          <p className="text-sm">
            Register as {<span className="font-bold">Employer</span>}?{" "}
            {
              <Link to={"signUp"} className="underline text-orange-500">
                Click Here
              </Link>
            }
          </p>
          <form onSubmit={handleSubmit(signIn)}>
            <label className="label" htmlFor="email">
              <span className="label-text">Email</span>
            </label>
            <label className="input-group">
              <input
                {...register("email", { required: true })}
                type="email"
                className="input w-full max-w-xs input-bordered"
                placeholder="Registered Email Id"
              />
              <span className="text-3xl">
                <EmailIcon fontSize="inherit" />
              </span>
            </label>
            <label className="label" htmlFor="password">
              <span className="label-text">Password</span>
            </label>
            <label className="input-group">
              <input
                {...register("password", { required: true })}
                type="password"
                className="input w-full max-w-xs input-bordered"
                placeholder="Password"
              />
              <span className="text-3xl">
                <LockIcon fontSize="inherit" />
              </span>
            </label>
            <p className="text-sm mt-5 mb-5">
              First time {<span className="font-bold">User</span>} or{" "}
              {<span className="font-bold">Forget Password</span>}?{" "}
              {
                <Link to={"signUp"} className="underline text-orange-500">
                  Click Here
                </Link>
              }
            </p>
            <button
              type="submit"
              className={`btn btn-primary ${signInLoading ? "loading" : ""}`}
              disabled={signInLoading}
            >
              {signInLoading ? "Loading" : "Login"}
            </button>
          </form>
          <p className="text-sm mt-5">Don&apos;t have email registered yet?</p>
          <p className="text-sm font-bold">Connect with RefugeeOne team to get started</p>
          {/*
          {auth.user ? (
            <>
              <p>Welcome {auth.user.email}</p>
              <button className="btn" onClick={signOut}>
                Sign out
              </button>
            </>
          ) : null}
          */}
          {/* <p className="text-xl">Note: this is a temporary sign up place</p>
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
          </form> */}
        </div>
      </div>
    </div>
  );
}
