//import Navbar from "@/components/Navbar";
import { useAuth } from "@/models";

export default function AdminDashboard() {
  const auth = useAuth();
  console.log(auth.user);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="">
        <p className="text-4xl">Hello, </p>
      </div>
      <p>Below are the admin privileges in order to manage the portal</p>
      <div className="flex flex-col mt-[20px] w-full h-full pl-[100px]">
        <div className="flex flex-row justify-around m-[30px] ">
          <div className="bg-slate-200 w-1/3">
            <p>Pending Job Request</p>
            <p>You have ? new pending job request</p>
          </div>
          <div className="bg-slate-200 w-1/3">
            <p>Pending Account Approval</p>
          </div>
        </div>
        <div className="flex flex-row justify-around m-[30px]">
          <div className="bg-slate-200 w-1/3">
            <p>Manage Posted Job Listing</p>
          </div>
          <div className="bg-slate-200 w-1/3">
            <p>Pending Job Request</p>
          </div>
        </div>
        <div className="flex flex-row justify-around m-[30px]">
          <div className="bg-slate-200 w-1/3">
            <p>Pending Job Request</p>
          </div>
          <div className="bg-slate-200 w-1/3">
            <p>Pending Job Request</p>
          </div>
        </div>
      </div>
    </div>
  );
}
