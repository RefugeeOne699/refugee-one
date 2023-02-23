import { useEffect, useState } from "react";

import { db, useAuth } from "@/models";

export default function Profile() {
  const auth = useAuth();
  const [profile, setProfile] = useState();

  useEffect(() => {
    console.log(auth.user);
    if (auth.user) {
      console.log("Setting profile");
      console.log("Users", auth.user.uid);
      db.pullData("Users", auth.user.uid).then((data) => {
        console.log("Data", data);
        setProfile(data);
      });
    }
  }, [auth.user]);

  return (
    <div className="flex flex-col justify-center items-center">
      <label className="label" htmlFor="name">
        <span className="label-text">Full Name</span>
      </label>
      <p className="input w-full max-w-xs input-bordered mb-4">{profile?.name}</p>
      <label className="label" htmlFor="email">
        <span className="label-text">Email</span>
      </label>
      <p className="input w-full max-w-xs input-bordered mb-4">{profile?.email}</p>
      <label className="label" htmlFor="phone">
        <span className="label-text">Phone</span>
      </label>
      <p className="input w-full max-w-xs input-bordered mb-4">{profile?.phone}</p>
      <label className="label" htmlFor="role">
        <span className="label-text">Role</span>
      </label>
      <p className="input w-full max-w-xs input-bordered mb-4">{profile?.role}</p>
    </div>
  );
}
