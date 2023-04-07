import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  query,
  // eslint-disable-next-line no-unused-vars
  QueryConstraint,
  runTransaction,
  setDoc,
} from "firebase/firestore";
import { createContext, useMemo } from "react";

import database from "@/clients/firebase";
import { JOB_STATUS } from "@/constants";

const JobContext = createContext({
  createJob: () => {},
  updateJob: () => {},
  approveJob: () => {},
  rejectJob: () => {},
  // todo
  deleteJob: () => {},
  /**
   * @param {string} _id - id of the job
   * @returns the job detail
   */
  getJob: (_id) => {},
  /**
   *
   * @param {undefined | QueryConstraint | QueryConstraint[]} _queryConstraints
   * @returns job list
   */
  listJobs: (_queryConstraints) => [],
  countJobs: (_queryConstraints) => Number,
});

const updateJob = async (jobId, payload) => {
  // remove the jobId field if existed. No need to put the doc id into the doc data
  if (payload.id) {
    delete payload.id;
  }
  // why use runTransaction? It may happen when you try to update a doc that may be deleted
  await runTransaction(database, async (transaction) => {
    const jobDocRef = doc(database, "Jobs", jobId);
    const jobDoc = await transaction.get(jobDocRef);
    if (!jobDoc.exists()) {
      throw `Job ${jobId} does not exist`;
    }
    transaction.update(jobDocRef, payload);
  });
};

const approveJob = async (jobId) => {
  await updateJob(jobId, { status: JOB_STATUS.APPROVED });
};

const rejectJob = async (jobId, adminMessage) => {
  await updateJob(jobId, { status: JOB_STATUS.REJECTED, adminMessage });
};

const JobContextProvider = ({ children }) => {
  const createJob = async (payload) => {
    await setDoc(doc(collection(database, "Jobs")), payload);
  };
  /**
   * get the detail of a job by id
   * @param {string} id
   * @returns job detail
   */
  const getJob = async (id) => {
    const jobDocRef = doc(database, "Jobs", id);
    const jobDoc = await getDoc(jobDocRef);
    const job = jobDoc.data();
    const ownerDoc = await getDoc(job.owner);
    job.owner = {
      uid: ownerDoc.id,
      name: ownerDoc.data().name,
    };
    return job;
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
   *    company: "name of the company"
   *    stauts: "pending",
   * }
   */
  const listJobs = async (queryConstraints) => {
    const jobCollection = collection(database, "Jobs");
    const jobQuery = queryConstraints
      ? query(jobCollection, queryConstraints)
      : jobCollection;
    const jobDocs = await getDocs(jobQuery);
    const jobList = jobDocs.docs.map(async (doc) => {
      const job = doc.data();
      return {
        id: doc.id,
        title: job.title,
        company: job.company,
        status: job.status,
        location: job.location,
        coordinate: job.coordinate,
        wage: job.wage,
        benefit: job.benefit,
        jobType: job.jobType,
        langEnglishLevel: job.langEnglishLevel,
        datePost: job.datePost,
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
      updateJob,
      approveJob,
      rejectJob,
      // todo
      deleteJob: () => {},
      getJob,
      listJobs,
      countJobs,
    }),
    []
  );

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};

export { JobContext, JobContextProvider };
