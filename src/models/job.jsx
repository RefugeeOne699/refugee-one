import { collection, doc, setDoc } from "firebase/firestore";
import { createContext, useMemo, useState } from "react";

import database from "@/clients/firebase";

const JobContext = createContext({
  job: undefined,
  createJob: () => {},
  // todo
  updateJob: () => {},
  // todo
  deleteJob: () => {},
});

const JobContextProvider = ({ children }) => {
  const [job, setJob] = useState();

  const createJob = async (payload) => {
    await setDoc(doc(collection(database, "Jobs")), payload);
    setJob(payload);
  };

  const value = useMemo(
    () => ({
      job,
      createJob,
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
