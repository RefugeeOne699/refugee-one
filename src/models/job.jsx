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
  where,
} from "firebase/firestore";
import { createContext, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

import database from "@/clients/firebase";
import { JOB_STATUS, ROLES } from "@/constants";

const JobContext = createContext({
  createJob: () => {},
  updateJob: () => {},
  approveJob: () => {},
  rejectJob: () => {},
  // todo
  deleteJob: () => {},
  transferJob: () => {},
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
  listJobs: (_userRole, _queryConstraints) => [],
  listSavedJobs: () => [],
  countJobs: (_queryConstraints, _userId) => Number,
});

const JobContextProvider = ({ children }) => {
  // create a job will link its owner with the job id
  const createJob = async (payload) => {
    await runTransaction(database, async (transaction) => {
      const uuid = uuidv4();
      const jobRef = doc(database, "Jobs", uuid);
      transaction = await transaction.set(jobRef, payload);
      const userJobsCollection = collection(payload.owner, "JobsCreated");
      const jobRefByUser = doc(userJobsCollection, uuid);
      await transaction.set(jobRefByUser, {});
    });
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
    if (!job.owner.uid && !job.owner.name) {
      const ownerDoc = await getDoc(job.owner);
      job.owner = {
        uid: ownerDoc.id,
        name: ownerDoc.data().name,
      };
    }
    return job;
  };

  const transferJob = async (jobID, newOwnerID) => {
    await runTransaction(database, async (transaction) => {
      // Step 1: Get the current job document
      const currentJob = await getJob(jobID);

      if (!currentJob) {
        // Handle the case where the job doesn't exist
        return;
      }
      // Extract current owner details
      const currentOwner = currentJob.owner.uid;

      // Step 2: Update the owner field in the job document
      const updatedJobData = {
        ...currentJob,
        owner: {
          uid: newOwnerID,
          // Other owner details, if any
        },
      };

      const jobRef = doc(database, "Jobs", jobID);
      const jobRefByCurrentOwner = doc(
        database,
        "Users",
        currentOwner,
        "JobsCreated",
        jobID
      );
      // Step 3: Remove the job from the current owner's "JobsCreated" collection
      const jobDocByCurrentOwner = await transaction.get(jobRefByCurrentOwner);

      transaction = transaction.update(jobRef, updatedJobData);
      if (jobDocByCurrentOwner.exists()) {
        transaction = await transaction.delete(jobRefByCurrentOwner);
      }

      // Step 4: Add the job to the new owner's "JobsCreated" collection
      const jobRefByNewOwner = doc(database, "Users", newOwnerID, "JobsCreated", jobID);
      transaction.set(jobRefByNewOwner, updatedJobData);
    });
  };

  const updateJob = async (jobId, payload) => {
    // remove the jobId field if existed. No need to put the doc id into the doc data
    if (payload.id) {
      delete payload.id;
    }
    if (payload.owner) {
      delete payload.owner;
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

  const deleteJob = async (id) => {
    const jobSavedCollection = collection(database, "Jobs", id, "UsersSavedBy");
    const usersAffected = (await getDocs(jobSavedCollection)).docs.map((doc) => doc.id);
    await runTransaction(database, async (transaction) => {
      const jobDocRef = doc(database, "Jobs", id);
      const jobDoc = await transaction.get(jobDocRef);
      if (!jobDoc.exists()) {
        return;
      }
      const owner = jobDoc.data().owner;
      if (owner && owner.uid) {
        const jobRefByCurrentOwner = doc(database, "Users", owner.uid, "JobsCreated", id);
        const jobDocByCurrentOwner = await transaction.get(jobRefByCurrentOwner);
        transaction = await transaction.delete(jobDocRef);
        if (jobDocByCurrentOwner.exists()) {
          await transaction.delete(jobRefByCurrentOwner);
        }
      } else {
        const jobRefByUser = doc(owner, "JobsCreated", id);
        const jobDocByUser = await transaction.get(jobRefByUser);

        transaction = await transaction.delete(jobDocRef);
        // compatibility: some jobs are created without linking with the user account
        if (jobDocByUser.exists()) {
          await transaction.delete(jobRefByUser);
        }
      }
      // for users that save this job, remove the save record
      for (let uid of usersAffected) {
        transaction = await transaction.delete(doc(jobSavedCollection, uid));
        transaction = await transaction.delete(
          doc(database, "Users", uid, "JobsSaved", id)
        );
      }
    });
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
  const listJobs = async (userRole, queryConstraints, userRef) => {
    const jobCollection = collection(database, "Jobs");
    // a temp fix: a temp fix that the client will only see the approved job
    const jobQuery =
      userRole === ROLES.CLIENT
        ? query(jobCollection, where("status", "==", JOB_STATUS.APPROVED))
        : userRole === ROLES.EMPLOYER
        ? queryConstraints
          ? query(jobCollection, where("owner", "==", userRef), queryConstraints)
          : query(jobCollection, where("owner", "==", userRef))
        : queryConstraints
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
        langNote: job.langNote,
        shift: job["shift"],
      };
    });
    return await Promise.all(jobList);
  };

  const listSavedJobs = async (userId) => {
    const jobsToFetch = collection(database, "Users", userId, "JobsSaved");
    const jobIds = (await getDocs(jobsToFetch)).docs.map((doc) => doc.id);
    const jobDocs = jobIds.map(async (jobId) => {
      return await getDoc(doc(database, "Jobs", jobId));
    });
    const fetchedJobs = await Promise.all(jobDocs);
    const jobList = fetchedJobs.map(async (doc) => {
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
        langNote: job.langNote,
        shift: job["shift"],
      };
    });
    return await Promise.all(jobList);
  };

  /**
   * Count the number of jobs that meets the certain conditions (pending jobs, jobs that are owned by the user)
   * @param {null | QueryConstraint | QueryConstraint[]} queryConstraints
   */
  const countJobs = async (queryConstraints, userRef) => {
    const jobCollection = collection(database, "Jobs");
    const jobQuery = userRef
      ? queryConstraints
        ? query(jobCollection, where("owner", "==", userRef), queryConstraints)
        : query(jobCollection, where("owner", "==", userRef))
      : queryConstraints
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
      deleteJob,
      transferJob,
      getJob,
      listJobs,
      listSavedJobs,
      countJobs,
    }),
    []
  );

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};

export { JobContext, JobContextProvider };
