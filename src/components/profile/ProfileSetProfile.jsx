import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import PlaceIcon from "@mui/icons-material/Place";
import { useRequest } from "ahooks";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { ROLES } from "@/constants";
import { useAuth } from "@/models";
import { getCoordinate } from "@/utils";

export default function ProfileSetProfile() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const { run: updateProfile, loading } = useRequest(
    async (data) => {
      const coordinate = await getCoordinate(
        data.address.street,
        data.address.city,
        data.address.state,
        data.address.zipcode
      );
      data.coordinate = coordinate;
      return auth.updateProfile(data);
    },
    {
      manual: true,
      onSuccess: async () => {
        toast.success("Profile updated");
        navigate("../", { replace: true });
        navigate(0); // todo: this is a temp fix to basic information not updated until refresh
      },
      onError: (error) => {
        toast.error(`Profile update failed: ${error.message}`);
      },
    }
  );

  const handleCancel = () => {
    navigate("../", { replace: true });
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(updateProfile)}>
        <div className="w-full flex flex-col items-center">
          <ul className="menu bg-base-100 px-12 w-full rounded-box">
            <li>
              <div className="flex justify-between">
                <div className="flex justify-start gap-4">
                  <PersonIcon />
                </div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Name</span>
                  </label>
                  <input
                    {...register("name", { required: true })}
                    type="text"
                    placeholder="name"
                    defaultValue={auth.user?.name}
                    className="input w-full input-bordered"
                  />
                </div>
              </div>
            </li>
            {auth.user?.role === ROLES.EMPLOYER ? (
              <li>
                <div className="flex justify-between">
                  <div className="flex justify-start gap-4">
                    <BusinessIcon />
                  </div>
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Company Name</span>
                    </label>
                    <input
                      {...register("companyName", { required: true })}
                      type="text"
                      placeholder="company name"
                      defaultValue={auth.user?.company}
                      className="input w-full input-bordered"
                    />
                  </div>
                </div>
              </li>
            ) : null}
            <li>
              <div className="flex justify-between">
                <div className="flex justify-start gap-4">
                  <PhoneIcon />
                </div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Phone Number</span>
                  </label>
                  <input
                    {...register("phone", { required: true })}
                    type="text"
                    placeholder="phone number"
                    defaultValue={auth.user?.phone}
                    className="input w-full input-bordered"
                  />
                </div>
              </div>
            </li>
            <li>
              <div className="flex justify-between">
                <div className="flex justify-start gap-4">
                  <PlaceIcon />
                </div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Address</span>
                  </label>
                  <input
                    {...register("address.street", { required: true })}
                    type="text"
                    placeholder="Address"
                    defaultValue={auth.user?.address?.street}
                    className="input w-full input-bordered"
                  />
                </div>
              </div>
            </li>
            <li>
              <div className="flex justify-between">
                <div className="flex justify-start gap-4">
                  <PlaceIcon />
                </div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">City</span>
                  </label>
                  <input
                    {...register("address.city", { required: true })}
                    type="text"
                    placeholder="City"
                    defaultValue={auth.user?.address?.city}
                    className="input w-full input-bordered"
                  />
                </div>
              </div>
            </li>
            <li>
              <div className="flex justify-between">
                <div className="flex justify-start gap-4">
                  <PlaceIcon />
                </div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">State</span>
                  </label>
                  <input
                    {...register("address.state", { required: true })}
                    type="text"
                    placeholder="State"
                    defaultValue={auth.user?.address?.state}
                    className="input w-full input-bordered"
                  />
                </div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Zipcode</span>
                  </label>
                  <input
                    {...register("address.zipcode", { required: true })}
                    type="text"
                    placeholder="Zipcode"
                    defaultValue={auth.user?.address?.zipcode}
                    className="input w-full input-bordered"
                  />
                </div>
              </div>
            </li>
          </ul>
          <div className="mt-4 m-2 flex flex-col md:flex-row md:gap-4 justify-center">
            <button
              type="submit"
              className={`btn btn-primary btn-xs btn-md lg:btn-lg m-2 ${
                loading ? "loading" : ""
              }`}
              disabled={loading}
            >
              {loading ? "loading" : "Save Profile"}
            </button>
            <button
              className={`btn btn-outline btn-xs btn-md lg:btn-lg m-2 ${
                loading ? "loading" : ""
              }`}
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
