import {
  collection,
  doc,
  getCountFromServer,
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
  // eslint-disable-next-line no-unused-vars
  countJobs: (queryConstraints) => Number,
});

const JobContextProvider = ({ children }) => {
  //   const [jobList, setJobList] = useState([]);
  const createJob = async (payload) => {
    await setDoc(doc(collection(database, "Jobs")), payload);
  };

  /**
   * get a list of JobBase according to the query provided
   * todo: pagination
   * why pagination needed?: please consider a time we have 1000 jobs, we could not download them at once,
   * otherwise the memory will overload
   * @param {null | QueryConstraint | QueryConstraint[]} queryConstraints
   * @returns a list of JobBase that only contains the title, company name and job id
   * JobBase will be like
   * {
   *    title: "title of the job",
   *    id: "id of the job doc",
   *    company: {
   *      name: "name of the company",
   *      id: "id of the company doc"
   *    }
   * }
   */
  const getJobs = async (queryConstraints) => {
    const jobCollection = collection(database, "Jobs");
    const jobQuery = queryConstraints
      ? query(jobCollection, queryConstraints)
      : jobCollection;
    const jobDocs = await getDocs(jobQuery);
    const jobList = jobDocs.docs.map(async (doc) => {
      const job = doc.data();
      const companyDoc = await getDoc(job.company);
      const company = {
        id: companyDoc.id,
        name: companyDoc.data().name,
      };
      return {
        id: doc.id,
        title: job.title,
        company,
      };
    });
    return await Promise.all(jobList);
  };
  /**
   * Count the number of jobs that meets the certain conditions (pending jobs, jobs that are owned by the user)
   * @param {null | QueryConstraint | QueryConstraint[]} queryConstraints
   */
  const countJobs = async (queryConstraints) => {
    const jobCollection = collection(database, "Jobs");
    const jobQuery = queryConstraints
      ? query(jobCollection, queryConstraints)
      : jobCollection;
    const snapshot = await getCountFromServer(jobQuery);
    return snapshot.data().count;
  };

  const value = useMemo(
    () => ({
      createJob,
      // todo
      updateJob: () => {},
      // todo
      deleteJob: () => {},
      getJobs,
      countJobs,
    }),
    []
  );

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};

export { JobContext, JobContextProvider };
