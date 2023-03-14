import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  // eslint-disable-next-line no-unused-vars
  QueryConstraint,
  setDoc,
} from "firebase/firestore";
import { createContext, useMemo } from "react";

import database from "@/clients/firebase";

const JobContext = createContext({
  createJob: () => {},
  // todo
  updateJob: () => {},
  // todo
  deleteJob: () => {},
  /**
   *
   * @param {undefined | QueryConstraint | QueryConstraint[]} queryConstraints
   * @returns job list
   */
  // eslint-disable-next-line no-unused-vars
  getJobs: (queryConstraints) => [],
});

const JobContextProvider = ({ children }) => {
  //   const [jobList, setJobList] = useState([]);
  const createJob = async (payload) => {
    await setDoc(doc(collection(database, "Jobs")), payload);
  };

  /**
   * get a list of job according to the query provided
   * todo: pagination
   * why pagination needed?: please consider a time we have 1000 jobs, we could not download them at once,
   * otherwise the memory will overload
   * @param {null | QueryConstraint | QueryConstraint[]} queryConstraints
   * @returns job list
   */
  const getJobs = async (queryConstraints) => {
    const jobCollection = collection(database, "Jobs");
    const jobQuery = queryConstraints
      ? query(jobCollection, queryConstraints)
      : jobCollection;
    const jobDocs = await getDocs(jobQuery);
    const jobList = jobDocs.docs.map(async (doc) => {
      const job = doc.data();
      job.id = doc.id;
      const owner = await getDoc(job.owner);
      job.owner = {
        ...owner.data(),
        uid: owner.id,
      };
      const company = await getDoc(job.company);
      job.company = {
        ...company.data(),
        id: company.id,
      };
      return job;
    });
    return await Promise.all(jobList);
  };

  const value = useMemo(
    () => ({
      createJob,
      // todo
      updateJob: () => {},
      // todo
      deleteJob: () => {},
      getJobs,
    }),
    []
  );

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};

export { JobContext, JobContextProvider };
