import { useEffect } from "react";

import { useAuth, useProfile } from "@/models";

export default function Profile() {
  const auth = useAuth();
  const prof = useProfile();
  // const [profile, setProfile] = useState();

  useEffect(() => {
    console.log(auth.user);
    if (auth.user) {
      prof.pullUser("Users", auth.user.uid);
    }
  }, [auth.user]);

  return (
    <div className="flex flex-col justify-center items-center">
      <label className="label" htmlFor="name">
        <span className="label-text">Full Name</span>
      </label>
      <p className="input w-full max-w-xs input-bordered mb-4">
        {prof.fetchedData?.name}
      </p>
      <label className="label" htmlFor="email">
        <span className="label-text">Email</span>
      </label>
      <p className="input w-full max-w-xs input-bordered mb-4">
        {prof.fetchedData?.email}
      </p>
      <label className="label" htmlFor="phone">
        <span className="label-text">Phone</span>
      </label>
      <p className="input w-full max-w-xs input-bordered mb-4">
        {prof.fetchedData?.phone}
      </p>
      <label className="label" htmlFor="role">
        <span className="label-text">Role</span>
      </label>
      <p className="input w-full max-w-xs input-bordered mb-4">
        {prof.fetchedData?.role}
      </p>
    </div>
  );
}
