import { useRequest } from "ahooks";
// import { sendEmailVerification } from "firebase/auth";
import { doc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

// import { auth as firebaseAuth } from "@/clients/firebase";
// fixme: temp hard code company
import database from "@/clients/firebase";
import { useAuth } from "@/models";
import { userTypes } from "@/utils/constants";

export default function SignUp() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  // follow this function for a better practice with interactive button

  const { run: signUp, loading: signUpLoading } = useRequest(
    // fixme: temp hard code company

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
        <label className="label" htmlFor="compnay">
          <span className="label-text">Company</span>
        </label>
        {/* fixme: a selector for companies, currently not required and has a default value */}
        <input
          {...register("company")}
          type="text"
          className="input w-full max-w-xs input-bordered mb-4"
          disabled
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
        <label className="label" htmlFor="role">
          <span className="label-text">Role</span>
        </label>
        <select
          className="input w-full max-w-xs input-bordered mb-4"
          {...register("role", { required: true })}
        >
          {userTypes.map((type, index) => {
            return (
              <option value={type} key={index}>
                {type}
              </option>
            );
          })}
        </select>
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
