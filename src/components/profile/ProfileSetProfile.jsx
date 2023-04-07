import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import PlaceIcon from "@mui/icons-material/Place";
import { useRequest } from "ahooks";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { useAuth, usePosition } from "@/models";

export default function ProfileSetProfile() {
  const auth = useAuth();
  const navigate = useNavigate();
  const position = usePosition();
  const { register, handleSubmit } = useForm();

  const { run: modifiedContent, loading: modificationLoading } = useRequest(
    async (data) => {
      return position
        .getCoordinate(
          data.address.street,
          data.address.city,
          data.address.state,
          data.address.zipcode
        )
        .then((coordinate) => {
          data.coordinate = coordinate;
          return auth.updateProfile(data);
        });
    },
    {
      manual: true,
      onSuccess: async () => {
        toast.success("Profile updated");
        navigate("../", { replace: true });
        navigate(0); // todo: this is a temp fix to basic information not updated until refresh
      },
      onError: () => {
        toast.error("Profile update failed");
      },
    }
  );

  const handleCancel = () => {
    navigate("../", { replace: true });
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(modifiedContent)}>
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
          <div className="m-2 flex flex-col md:flex-row md:gap-4 justify-center">
            <button type="submit" className="btn btn-xs btn-md lg:btn-lg m-2">
              {modificationLoading ? "loading" : "Save Profile"}
            </button>
            <button className="btn btn-xs btn-md lg:btn-lg m-2" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
