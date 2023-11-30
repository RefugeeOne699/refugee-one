import { useRequest } from "ahooks";
import { collection, getDocs, query, where } from "firebase/firestore";
import { React, useState } from "react";
import { toast } from "react-hot-toast";

import database from "@/clients/firebase";
import { JOB_STATUS, ROLES, USER_STATUS } from "@/constants";
import { useAdmin, useJob } from "@/models";

export default function UserView({ user, refresh, allUsers }) {
  const { approveUser, deleteUser } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const job = useJob();
  let selectedUserId = null;

  const hideModal = () => {
    setShowModal(false);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const fetchData = async () => {
    if (selectedUser) {
      // Extract id of selectedUser from allUsers
      allUsers.forEach((adminUser) => {
        if (adminUser.role === "admin" && adminUser.name === selectedUser) {
          selectedUserId = adminUser.id;
          console.log("selectedUserId" + selectedUserId);
          console.log("selectedUser" + selectedUser);
        }
      });
    }
    const jobCollection = collection(database, "Jobs");
    const jobQuery = query(jobCollection, where("status", "==", JOB_STATUS.APPROVED));

    try {
      const querySnapshot = await getDocs(jobQuery);

      querySnapshot.forEach(async (document) => {
        const jobId = document.id;

        // Call GetJob with the jobId to get the existing owner of the job
        const data = await job.getJob(jobId);
        // Check and extract all jobs corresponding to the logged-in user
        if (data.owner && data.owner.uid && data.owner.uid === user.id) {
          job
            .transferJob(jobId, selectedUserId)
            .then(() => {
              toast.success(`Transfer Successful`);
              hideModal();
            })
            .catch((error) => {
              toast.error(`Failed to transfer job: ${error}`);
            });
        }
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const transfer = () => {
    fetchData();
  };

  const approveUserRequest = useRequest(async () => approveUser(user.id), {
    manual: true,
    onSuccess: async () => {
      toast.success("Employer has been approved!");
      await refresh();
    },
    onError: () => {
      toast.error("Failed to approve Employer");
    },
  });

  const rejectUserRequest = useRequest(async () => deleteUser(user.id), {
    manual: true,
    onSuccess: async () => {
      toast.success("User has been removed!");
      await refresh();
    },
    onError: () => {
      toast.error("Failed to remove user");
    },
  });

  const reject = async () => {
    await rejectUserRequest.run(user.id);
  };

  const approve = async () => {
    await approveUserRequest.run(user.id);
  };

  /* todo: make the styling to other places that show phone number */
  const stylePhoneNumber = (number) => {
    if (number.length !== 10) {
      return number;
    } else {
      return `${number.slice(0, 3)}-${number.slice(3, 6)}-${number.slice(6, 11)}`;
    }
  };

  return (
    <div className="">
      <div key={user.id} className="w-full flex flex-row pt-3 pb-3 border-b-2">
        <div className="flex basis-3/12 shrink-1 justify-start align-center">
          <p className="ml-5">{user.name}</p>
        </div>
        <div className="flex basis-3/12 flex-col justify-start align-center">
          <p>{user.email}</p>
          <p>{user.role}</p>
          <p>{stylePhoneNumber(user.phone)}</p>
        </div>
        <div className="flex basis-3/12 justify-start align-center">
          <p>{user.company}</p>
        </div>
        <div className="flex flex-row basis-3/12 justify-start align-center">
          {user.status === USER_STATUS.PENDING ? (
            <div className="flex flex-row justify-evenly w-full">
              <button className="btn btn-primary" onClick={approve}>
                Approve
              </button>
              <button className="btn" onClick={reject}>
                Reject
              </button>
            </div>
          ) : (
            <div className="flex flex-row justify-center w-full">
              <button className="btn btn-primary mr-4" onClick={reject}>
                Remove Account
              </button>
              {user.role === ROLES.ADMIN && (
                <div>
                  <button
                    className="border-2 border-primary rounded-2xl w-full h-16 p-2"
                    onClick={openModal}
                  >
                    Transfer Account
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {showModal && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-screen h-screen bg-opacity-50 bg-gray-300">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold p-4">Transfer Jobs</h2>
            <p></p>
            <div className="flex flex-row items-center pb-4">
              <label className="label flex basis-48 ml-4" htmlFor="from">
                From
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={user.name}
                disabled
              />
            </div>
            <div className="flex flex-row items-center">
              <label className="label flex basis-48 ml-4" htmlFor="to">
                To
              </label>
              <select
                className="select select-bordered"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                <option value="">Select a user</option>
                {allUsers
                  .filter((item) => item.role === "admin")
                  .map((adminUser, index) => (
                    <option key={index} value={adminUser.name}>
                      {adminUser.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex flex-row items-center p-4">
              <button
                className="border-2 border-primary rounded-2xl p-2 mr-4"
                onClick={hideModal}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={transfer}>
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
