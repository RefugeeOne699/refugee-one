import { useRequest } from "ahooks";
import { collection, doc, getDocs, runTransaction } from "firebase/firestore";
import { createContext, useEffect, useMemo, useState } from "react";

import database from "@/clients/firebase";

import { useAuth } from ".";

const JobSaveContext = createContext({
  jobsSaved: new Set(),
  jobsSavedLoading: false,
  saveJobLoading: false,
  /**
   * save a job if it's unsaved, unsave a job if it's saved
   * @param {string} _jobId
   */
  updateJobSave: async (_jobId) => {},
  /**
   * check if a job is saved by the user
   * @param {string} _jobId
   * @returns true if the job is saved
   */
  checkIsJobSaved: async (_jobId) => Boolean,
});

const JobSaveContextProvider = ({ children }) => {
  const [jobsSaved, setJobsSaved] = useState(new Set());
  const auth = useAuth();
  const saveJob = useRequest(
    async (jobId, uid) => {
      await runTransaction(database, async (transaction) => {
        const userSaveCollection = collection(database, "Users", uid, "JobsSaved");
        const userSaveRef = doc(userSaveCollection, jobId);
        const userSaveDoc = await transaction.get(userSaveRef);

        const jobSavedCollection = collection(database, "Jobs", jobId, "UsersSavedBy");
        const jobSavedRef = doc(jobSavedCollection, uid);
        const jobSavedDoc = await transaction.get(jobSavedRef);

        if (userSaveDoc.exists() && jobSavedDoc.exists()) {
          await transaction.delete(userSaveRef);
          await transaction.delete(jobSavedRef);
          jobsSaved.delete(jobId);
        } else {
          await transaction.set(userSaveRef, {});
          await transaction.set(jobSavedRef, {});
          jobsSaved.add(jobId);
        }
        setJobsSaved(jobsSaved);
      });
    },
    {
      manual: true,
      debounceWait: 100,
    }
  );

  const checkIsJobSaved = (jobId) => {
    // const saveCollection = collection(database, "Users", uid, "JobsSaved");
    // const saveRef = doc(saveCollection, jobId);
    // const saveDoc = await getDoc(saveRef);
    // return saveDoc.exists();
    return jobsSaved.has(jobId);
  };

  const pullJobsSaved = useRequest(
    async (uid) => {
      const saveCollection = collection(database, "Users", uid, "JobsSaved");
      const saveDocs = await getDocs(saveCollection);
      return saveDocs.docs;
    },
    {
      manual: true,
      pollingInterval: 300000,
      onSuccess: (docs) => {
        jobsSaved.clear();
        docs.forEach((doc) => {
          jobsSaved.add(doc.id);
        });
        setJobsSaved(jobsSaved);
      },
    }
  );

  useEffect(() => {
    (async () => {
      const uid = auth.user?.uid;
      if (uid) {
        pullJobsSaved.cancel();
        await pullJobsSaved.run(uid);
      }
    })();
  }, [auth.user]);

  const value = useMemo(
    () => ({
      jobsSaved,
      jobsSavedLoading: pullJobsSaved.loading,
      saveJob,
      checkIsJobSaved,
    }),
    [jobsSaved, pullJobsSaved.loading, saveJob.loading]
  );
  return <JobSaveContext.Provider value={value}>{children}</JobSaveContext.Provider>;
};

export { JobSaveContext, JobSaveContextProvider };
