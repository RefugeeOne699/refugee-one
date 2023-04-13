import InfoIcon from "@mui/icons-material/Info";
import { useRequest } from "ahooks";
import { toast } from "react-hot-toast";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "@/models";

export default function ConfirmSendEmail() {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const emailForResend = location.state?.email;

  // if there's no email from the resetPassword page (someone directly goes to this confirm page)
  // force to go to signIn
  if (!emailForResend) {
    return <Navigate to="/signIn" replace />;
  }

  if (auth.isSignedIn()) {
    return <Navigate to="/" replace />;
  }
  // follow this function for a better practice with interactive button
  const { run: resendEmail, loading: Loading } = useRequest(
    async () => auth.resetPassWordByEmail(emailForResend),
    {
      manual: true,
      onSuccess: async () => {
        toast.success("Email Resent!");
      },
      onError: (error) => {
        if (error.code === "auth/user-not-found") {
          toast.error("Failed: Email hasn't been regsitered by RefugeeOne!");
        } else if (error.code === "auth/invalid-email") {
          toast.error("Failed: This is not a valid email!");
        } else if (error.code === "auth/too-many-requests") {
          toast.error("Too many requests! Please retry after 60s.");
        } else {
          // firebase has limits on numbers to reset password. Hard to include all error codes
          toast.error("Sorry something is wrong. Please come back later.");
        }
        console.log(error.code);
      },
    }
  );

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="card max-w-md">
        <div className="card-body">
          <p className="mb-5 text-3xl">Great!</p>
          <p className="mb-1 text-xl">We have sent you an email to set new password! </p>
          <p className="mb-1 text-sm">
            <InfoIcon />
            Please allow some time for the email to be delivered. Make sure you also check
            your JUNK and SPAM folders! After setting the password, you can go back and
            login using this email and password.
          </p>
          <br />
          <button
            className={`btn btn-primary w-1/3`}
            onClick={() => {
              navigate("/signIn", { replace: true });
            }}
            disabled={Loading}
          >
            OK
          </button>
          <p>
            Didn&apos;t receive the email?
            <button
              className="btn btn-link"
              disabled={Loading}
              onClick={() => resendEmail()}
            >
              Send Again
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
