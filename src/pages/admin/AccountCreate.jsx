import InfoIcon from "@mui/icons-material/Info";
import { useRequest } from "ahooks";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { ROLES } from "@/constants";
// import { ROLES } from "@/constants";
import { useAuth } from "@/models";
/**
 * this is for admin to create an account.
 * this page could only be visited by admin
 */
export default function AccountCreate() {
  const auth = useAuth();
  const { register, handleSubmit } = useForm();

  const { run: signUp, loading: signUpLoading } = useRequest(
    async (data) => auth.signUp(data),
    {
      manual: true,
      onSuccess: async () => {
        toast.success(
          "The account has been created. The new user should set the password before sign in."
        );
      },
      onError: (error) => {
        toast.error("Create account Failed: " + error.message);
      },
    }
  );

  const onSubmit = async (data) => {
    await signUp({
      ...data,
      phone: 999999999,
      company: "default",
    });
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="card max-w-md">
        <div className="card-body">
          <p className="mb-5 text-2xl">Create an Account</p>
          <p>
            <InfoIcon /> <text-bold>Note:</text-bold>
            Kindly assist newly added clients to update their phone number and address on
            their profile page once logged in. <br /> Updating address will enable
            distance functionality when viewing jobs.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <label className="label" htmlFor="name">
                <span className="label-text">Full Name</span>
              </label>
              <input
                {...register("name", { required: true })}
                type="text"
                className="input w-full input-bordered"
              />
            </div>
            <div>
              <label className="label" htmlFor="email">
                <span className="label-text">Email</span>
              </label>
              <input
                {...register("email", { required: true })}
                type="email"
                className="input w-full input-bordered"
              />
            </div>
            <div>
              <label className="label" htmlFor="role">
                <span className="label-text">Role</span>
              </label>
              <div className="flex flex-row justify-start gap-16">
                {[ROLES.ADMIN, ROLES.CLIENT].map((item, index) => {
                  return (
                    <label
                      className="label cursor-pointer flex flex-row gap-4"
                      key={index}
                    >
                      <input
                        type="radio"
                        name="RADIO_ROLE"
                        className="radio radio-primary"
                        {...register("role")}
                        value={item}
                        //   checked the first radio
                      />
                      <span className="label-text">{item}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            <button
              type="submit"
              className={`btn btn-primary ${signUpLoading ? "loading" : ""}`}
              disabled={signUpLoading}
            >
              {signUpLoading ? "Loading" : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
