import { useRequest } from "ahooks";
import { toast } from "react-hot-toast";
import { Navigate } from "react-router-dom";

import Center from "@/components/Center";
import Spin from "@/components/Spin";
import { useAuth } from "@/models";

export default function SignOut() {
  const { signOut } = useAuth();
  const { loading } = useRequest(async () => signOut(), {
    onSuccess: () => {
      toast.success("Logout successful");
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });

  const spinning = (
    <Center className="w-screen h-screen">
      <Spin className="h-10 w-10" />
    </Center>
  );

  if (loading) {
    return spinning;
  }

  return <Navigate to="/signIn" replace />;
}
