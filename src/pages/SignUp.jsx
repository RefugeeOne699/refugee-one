import { useRequest } from "ahooks";
// import { sendEmailVerification } from "firebase/auth";
import { doc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// import { auth as firebaseAuth } from "@/clients/firebase";
import database from "@/clients/firebase";
import { useAuth } from "@/models";

export default function SignUp() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  // follow this function for a better practice with interactive button

  const { run: signUp, loading: signUpLoading } = useRequest(
    // No harding for company required as it will be entered by user when registering for first time

    async (data) =>
      auth.signUp({
        ...data,
        // fixme: temp hard code company
        company: doc(database, "Companies", "KJLOQ9jWh9zsc3JfBugR"),
      }),
    {
      manual: true,
      onSuccess: async () => {
        // fixme: temp for demo
        // if (!firebaseAuth.currentUser.emailVerified) {
        //   await sendEmailVerification(firebaseAuth.currentUser).then(() => {
        //     auth.signOut();
        //     alert(
        //       "We have sent you a verification email! \n Please verfiy your email before logging in!"
        //     );
        //   });
        // }
        toast.success("Registration Successful");
        navigate("/");
      },
      onError: (error) => {
        //todo: handle error
        toast.error("Registration Failed");
        console.error(error);
      },
    }
  );

  if (auth.user) {
    console.log(auth.user);
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="card max-w-md">
        <div className="card-body">
          <p className="mb-5 text-2xl">Register With RefugeeOne Job Search Portal</p>
          <form onSubmit={handleSubmit(signUp)}>
            <label className="label" htmlFor="name">
              <span className="label-text">Full Name</span>
            </label>
            <input
              {...register("name", { required: true })}
              type="text"
              className="input w-full max-w-xs input-bordered"
            />
            <label className="label" htmlFor="email">
              <span className="label-text">Email</span>
            </label>
            <input
              {...register("email", { required: true })}
              type="email"
              className="input w-full max-w-xs input-bordered mb-4"
            />
            <label className="label" htmlFor="compnay">
              <span className="label-text">Company Name</span>
            </label>
            <input
              {...register("company")}
              type="text"
              className="input w-full max-w-xs input-bordered mb-4"
              disabled
            />
            <label className="label" htmlFor="phone">
              <span className="label-text">Phone Number</span>
            </label>
            <input
              {...register("phone", { required: true })}
              type="number"
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
            <label className="label" htmlFor="role">
              <span className="label-text">Role</span>
            </label>
            <input
              {...register("role", { value: "employer" })}
              type="text"
              className="input w-full max-w-xs input-bordered mb-4"
              disabled
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
      </div>
    </div>
  );
}
