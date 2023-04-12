import { useRequest } from "ahooks";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { ROLES } from "@/constants";
import { useAuth } from "@/models";
/**
 * this is for employer self-service sign up.
 * this page can be accessed without sign in
 */
export default function EmployerSignUp() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const { run: signUp, loading: signUpLoading } = useRequest(
    async (data) => auth.signUp(data),
    {
      manual: true,
      onSuccess: async () => {
        toast.success(
          "Registration Successful. Please wait for approval from the admin team"
        );
        navigate("/signIn");
      },
      onError: (error) => {
        toast.error("Registration Failed: " + error.message);
      },
    }
  );

  const onSubmit = async (data) => {
    await signUp({
      ...data,
      role: ROLES.EMPLOYER,
    });
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="card max-w-md">
        <div className="card-body">
          <p className="mb-5 text-2xl">Register With RefugeeOne Job Search Portal</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="label" htmlFor="name">
              <span className="label-text">Full Name</span>
            </label>
            <input
              {...register("name", { required: true })}
              type="text"
              className="input w-full input-bordered"
            />
            <label className="label" htmlFor="email">
              <span className="label-text">Email</span>
            </label>
            <input
              {...register("email", { required: true })}
              type="email"
              className="input w-full input-bordered mb-4"
            />
            <label className="label" htmlFor="compnay">
              <span className="label-text">Company Name</span>
            </label>
            <input
              {...register("company")}
              type="text"
              className="input w-full input-bordered mb-4"
            />
            <label className="label" htmlFor="phone">
              <span className="label-text">Phone Number</span>
            </label>
            <input
              {...register("phone", { required: true })}
              type="number"
              className="input w-full input-bordered mb-4"
            />
            <label className="label" htmlFor="role">
              <span className="label-text">Role</span>
            </label>
            <input
              {...register("role", { value: "employer" })}
              type="text"
              className="input w-full input-bordered mb-8"
              disabled
            />
            <button
              type="submit"
              className={`btn btn-primary${signUpLoading ? "loading" : ""}`}
              disabled={signUpLoading}
            >
              {signUpLoading ? "Loading" : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
