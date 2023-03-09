import { useEffect } from "react";

import { useAuth } from "@/models";

export default function Profile() {
  const auth = useAuth();
  
  return (
    <div className="flex flex-col justify-center items-center">
      <label className="label" htmlFor="name">
        <span className="label-text">Full Name</span>
      </label>
      <p className="input w-full max-w-xs input-bordered mb-4">
        {auth.user?.name}
      </p>
      <label className="label" htmlFor="email">
        <span className="label-text">Email</span>
      </label>
      <p className="input w-full max-w-xs input-bordered mb-4">
        {auth.user?.email}
      </p>
      <label className="label" htmlFor="phone">
        <span className="label-text">Phone</span>
      </label>
      <p className="input w-full max-w-xs input-bordered mb-4">
        {auth.user?.phone}
      </p>
      <label className="label" htmlFor="role">
        <span className="label-text">Role</span>
      </label>
      <p className="input w-full max-w-xs input-bordered mb-4">
        {auth.user?.role}
      </p>
    </div>
  );
}
