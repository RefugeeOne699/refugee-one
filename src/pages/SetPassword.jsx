import EmailIcon from "@mui/icons-material/Email";
import InfoIcon from "@mui/icons-material/Info";
import { useRequest } from "ahooks";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "@/models";

export default function SetPassword() {
  const auth = useAuth();
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  if (auth.isSignedIn()) {
    return <Navigate to="/" replace />;
  }

  // follow this function for a better practice with interactive button
  const { run: sendPasswordResetEmail, loading: Loading } = useRequest(
    async (data) => {
      await auth.resetPassWordByEmail(data.email);
      return data.email;
    },
    {
      manual: true,
      onSuccess: async (email) => {
        toast.success("Email Sent!");
        const emailToPass = { email: email };
        navigate("/confirm_send_email", { state: emailToPass });
      },
      onError: (error) => {
        if (error.code === "auth/user-not-found") {
          toast.error("Failed: Email hasn't been regsitered by RefugeeOne!");
        } else if (error.code === "auth/invalid-email") {
          toast.error("Failed: This is not a valid email!");
        } else {
          // firebase has limits on numbers to reset password. Hard to include all error codes
          toast.error("Sorry, something is wrong. Please come back later.");
        }
        console.log(error.code);
      },
    }
  );

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="card max-w-md">
        <div className="card-body">
          <p className="mb-5 text-3xl">Welcome!</p>
          <p className="mb-1 text-xl">Please enter your email</p>
          <p className="mb-1 text-sm">
            <InfoIcon />
            Please make sure your email has been registered by the RefugeeOne team. Once
            you enter a registed email, we will send you a link to set your account
            password!
          </p>
          <form onSubmit={handleSubmit(sendPasswordResetEmail)}>
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
            <br />
            <button
              type="submit"
              className={`btn btn-primary mr-4 ${Loading ? "loading" : ""}`}
              disabled={Loading}
            >
              {Loading ? "Loading" : "Confirm"}
            </button>
            <button
              type="button"
              className={`btn btn-ghost`}
              disabled={Loading}
              onClick={() => {
                navigate("/signIn", { replace: true });
              }}
            >
              Back
            </button>
          </form>

          <div className="text-sm mt-32">
            <div className="flex justify-start gap-4">
              <EmailIcon fontSize="small" />
              Don&apos;t have email registered yet with RefugeeOne?
            </div>
            <div className="flex space-around gap-4 text-sm">
              {
                <a
                  href="https://www.refugeeone.org/contact.html"
                  className="underline text-orange-500"
                  target="_blank"
                  rel="noreferrer"
                >
                  Connect with RefugeeOne team to get started
                </a>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
