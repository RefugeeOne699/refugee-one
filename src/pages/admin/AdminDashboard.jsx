//import Navbar from "@/components/Navbar";
//import database from "@/clients/firebase";
import { useAuth, useJob } from "@/models";

export default function AdminDashboard() {
    const auth = useAuth();

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="">
                <p className="text-4xl">Hello, {auth.user.name}
                </p>
            </div>
            <p className="pt-4">Below are the admin privileges in order to manage the portal</p>
            <div className="flex flex-col mt-[20px] w-full h-full pl-[100px]">
                <div className="flex flex-row justify-around m-[30px] ">
                    <div className="bg-slate-200 w-1/3 p-4 rounded-xl">
                        <p className="text-lg font-semibold">Pending Job Request</p>
                        <div className="flex flex-col items-center">
                            <p className="self-start p-2">You have 1 new pending job request</p>
                            <button className="btn btn-outline self-center">View</button>
                        </div>

                    </div>
                    <div className="bg-slate-200 w-1/3 p-4 rounded-xl">
                        <p className="text-lg font-semibold">Pending Account Approval</p>
                        <div className="flex flex-col items-center">
                            <p className="self-start p-2">You have 2 new account approval request</p>
                            <button className="btn btn-outline">View</button>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row justify-around m-[30px]">
                    <div className="bg-slate-200 w-1/3 p-4 rounded-xl">
                        <p className="text-lg font-semibold">Manage Posted Job Listing</p>
                        <div className="flex flex-col items-center">
                            <p className="self-start p-2">Admins can delete/edit posted job listing</p>
                            <button className="btn btn-outline">Job listings</button>
                        </div>
                    </div>
                    <div className="bg-slate-200 w-1/3 p-4 rounded-xl">
                        <p className="text-lg font-semibold">Manage Added Account</p>
                        <div className="flex flex-col items-center">
                            <p className="self-start p-2">Admins can delete approved accounts</p>
                            <button className="btn btn-outline">Approved accounts</button>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row justify-around m-[30px]">
                    <div className="bg-slate-200 w-1/3 p-4 rounded-xl">
                        <p className="text-lg font-semibold">Add Admins to Portal</p>
                        <div className="flex flex-col items-center">
                            <p className="self-start p-2">Admins can add new admins and remove exiting admins</p>
                            <button className="btn btn-outline ">Existing admins</button>
                        </div>
                    </div>
                    <div className="bg-slate-200 w-1/3 p-4 rounded-xl">
                        <p className="text-lg font-semibold">Import data via Bulk upload</p>
                        <div className="flex flex-col items-center">
                            <p className="self-start p-2">Admins can do bulk upload of employer data via csv file upload</p>
                            <button className="btn btn-outline">Upload data</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
