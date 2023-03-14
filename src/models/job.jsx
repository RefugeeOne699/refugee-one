import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { createContext, useMemo, useState } from "react";

import database from "@/clients/firebase";

const JobContext = createContext({
  job: undefined,
  createJob: () => {},
  // todo
  updateJob: () => {},
  // todo
  deleteJob: () => {},
  approveJob: () => {},
  rejectJob: () => {},
});

const JobContextProvider = ({ children }) => {
  const [job, setJob] = useState();

  const createJob = async (payload) => {
    await setDoc(doc(collection(database, "Jobs")), payload);
    setJob(payload);
  };

  const approveJob = async (jobId) => {
    await updateDoc(doc(database, "Jobs", jobId), { status: "approved" });
  };

  const rejectJob = async (jobId, rejectMessage) => {
    await updateDoc(doc(database, "Jobs", jobId), {
      status: "rejected",
      message: rejectMessage,
    });
  };

  const value = useMemo(
    () => ({
      job,
      createJob,
      approveJob,
      rejectJob,
      // todo
      updateJob: () => {},
      // todo
      deleteJob: () => {},
    }),
    [job]
  );

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};

export { JobContext, JobContextProvider };
