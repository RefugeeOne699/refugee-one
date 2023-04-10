import { useRequest } from "ahooks";
import { toast } from "react-hot-toast";

import { USER_STATUS } from "@/constants";
import { useAdmin } from "@/models";

export default function UserView({ user, run }) {
  const { approveUser, deleteUser } = useAdmin();

  const approveUserRequest = useRequest(async () => approveUser(user.id), {
    manual: true,
    onSuccess: () => {
      toast.success("Employer has been approved!");
      run();
    },
    onError: () => {
      toast.error("Failed to approve Employer");
    },
  });

  const rejectUserRequest = useRequest(async () => deleteUser(user.id), {
    manual: true,
    onSuccess: () => {
      toast.success("User has been removed!");
      run();
    },
    onError: () => {
      toast.error("Failed to remove user");
    },
  });

  const reject = async () => {
    rejectUserRequest.run(user.id);
  };

  const approve = async () => {
    approveUserRequest.run(user.id);
  };

  const stylePhoneNumber = (number) => {
    if (number.length !== 10) {
      return number;
    } else {
      return `${number.slice(0, 3)}-${number.slice(3, 6)}-${number.slice(6, 11)}`;
    }
  };

  return (
    <div key={user.id} className="w-full flex flex-row pt-3 pb-3 border-b-2">
      <div className="flex basis-3/12 shrink-1 justify-start	align-center">
        <p className="ml-5">{user.name}</p>
      </div>
      <div className="flex basis-3/12 flex-col justify-start	align-center">
        <p>{user.email}</p>
        <p>{stylePhoneNumber(user.phone)}</p>
      </div>
      <div className="flex basis-3/12 justify-start	align-center">
        <p>{user.company}</p>
      </div>
      <div className="flex flex-row basis-3/12 justify-start	align-center">
        {user.status === USER_STATUS.PENDING ? (
          <div className="flex flex-row justify-evenly w-full">
            <button
              className="btn btn-primary"
              onClick={() => {
                approve(user.id);
              }}
            >
              Approve
            </button>
            <button
              className="btn"
              onClick={() => {
                reject(user.id);
              }}
            >
              Reject
            </button>
          </div>
        ) : (
          <div className="flex flex-row justify-center w-full">
            <button
              className="btn btn-primary"
              onClick={() => {
                reject(user.id);
              }}
            >
              Remove Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
