import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BadgeIcon from "@mui/icons-material/Badge";
import EmailIcon from "@mui/icons-material/Email";
import InfoIcon from "@mui/icons-material/Info";
import LockIcon from "@mui/icons-material/Lock";
import LockResetIcon from "@mui/icons-material/LockReset";
import { useRequest } from "ahooks";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "@/models";

export default function SignIn() {
  const auth = useAuth();
  const { register, handleSubmit } = useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  if (auth.isSignedIn()) {
    return <Navigate to="/" replace />;
  }

  // follow this function for a better practice with interactive button
  const { run: signIn, loading: signInLoading } = useRequest(
    async (data) => auth.signIn(data),
    {
      manual: true,
      onSuccess: async () => {
        toast.success("Sign in succeeded");
        navigate(from, { replace: true });
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

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="card max-w-md">
        <div className="card-body">
          <p className="mb-5 text-3xl">Login To RefugeeOne Job Search Portal</p>
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
            <br />
            <label className="text-sm">
              <div className="flex justify-end gap-2">
                {/* @tianchi todo: add link to reset password page */}
                <LockResetIcon fontSize="medium" />
                {
                  <Link to="/" className="underline text-orange-500">
                    Forgot password?
                  </Link>
                }
              </div>
            </label>
            <button
              type="submit"
              className={`btn btn-primary ${signInLoading ? "loading" : ""}`}
              disabled={signInLoading}
            >
              {signInLoading ? "Loading" : "Login"}
              <ArrowForwardIcon fontSize="medium" />
            </button>
          </form>
          <div>
            <hr
              style={{
                background: "#666663",
                height: "2px",
                border: "none",
                margin: "1rem 0 1rem 0",
              }}
            />
          </div>
          <div className="text-sm">
            <div className="flex justify-start gap-4">
              <InfoIcon fontSize="small" />
              First Time Acessing RefugeeOne Work Search Portal?
            </div>
            {/* @tianchi todo: add link to set password page */}
            <div className="flex space-around gap-4 text-sm">
              {
                <Link to="/" className="underline text-orange-500">
                  Click Here To Set Password For First Time
                </Link>
              }
            </div>
          </div>
          <br />
          <div className="text-sm">
            <div className="flex justify-start gap-4">
              <BadgeIcon fontSize="small" />
              New Employer to RefugeeOne?{" "}
            </div>
            <div className="flex space-around gap-4 text-sm">
              {
                <Link to="/signUp" className="underline text-orange-500">
                  Click Here To Register
                </Link>
              }
            </div>
          </div>
          <br />
          <div className="text-sm">
            <div className="flex justify-start gap-4">
              <EmailIcon fontSize="small" />
              Don&apos;t have email registered yet with RefugeeOne?{" "}
            </div>
            <div className="flex space-around gap-4 text-sm">
              {
                <a
                  href="https://www.refugeeone.org/contact.html"
                  className="underline text-orange-500"
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
