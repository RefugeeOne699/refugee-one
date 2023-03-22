import { useAuth } from "@/models";
import { Outlet } from "react-router-dom";

export default function Profile() {
  const auth = useAuth();
  const parseName = (name) => {
    let nameArray = name.split(" ");
    if (nameArray.length > 1) {
      return nameArray[0][0] + " " + nameArray[1][0];
    }
    return nameArray[0];
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col justify-center items-center">
        <div className="avatar">
          <div className="w-24 rounded-full bg-stone-700">
            <div className="w-full h-full flex flex-col justify-center">
              <p className="text-center font-black text-3xl italic">
                {auth.user?.name ? parseName(auth.user?.name) : "NA"}
              </p>
            </div>
          </div>
        </div>
        <p className="text-center m-4">{auth.user?.email}</p>
      </div>
      <Outlet />
    </div>

    // <div className="flex flex-col justify-center items-center">
    //   <label className="label" htmlFor="name">
    //     <span className="label-text">Full Name</span>
    //   </label>
    //   <p className="input w-full max-w-xs input-bordered mb-4">{auth.user?.name}</p>
    //   <label className="label" htmlFor="email">
    //     <span className="label-text">Email</span>
    //   </label>
    //   <p className="input w-full max-w-xs input-bordered mb-4">{auth.user?.email}</p>
    //   <label className="label" htmlFor="phone">
    //     <span className="label-text">Phone</span>
    //   </label>
    //   <p className="input w-full max-w-xs input-bordered mb-4">{auth.user?.phone}</p>
    //   <label className="label" htmlFor="role">
    //     <span className="label-text">Role</span>
    //   </label>
    //   <p className="input w-full max-w-xs input-bordered mb-4">{auth.user?.role}</p>
    // </div>
  );
}
