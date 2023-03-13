import {
  collection,
  getDoc,
  onSnapshot,
  query,
  // eslint-disable-next-line no-unused-vars
  QueryConstraint,
  where,
} from "firebase/firestore";
import { createContext, useEffect, useMemo, useState } from "react";

import database from "@/clients/firebase";
import { useAuth } from "@/models";

const AdminContext = createContext({
  pendingJobList: [],
});

const AdminContextProvider = ({ children }) => {
  const auth = useAuth();
  // todo: somewhere deny access, should be in main.jsx
  //   if (auth.user.role !== "admin") {
  //     console.error("?");
  //   }
  const [pendingJobList, setPendingJobList] = useState([]);

  let unsubscribe;
  useEffect(() => {
    if (unsubscribe) {
      unsubscribe();
    }
    const pendingQuery = query(
      collection(database, "Jobs"),
      where("status", "==", "pending")
    );
    unsubscribe = onSnapshot(pendingQuery, (qSnap) => {
      (async () => {
        const newListPromise = qSnap.docs.map(async (doc) => {
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
        const newList = await Promise.all(newListPromise);
        setPendingJobList(newList);
      })();
    });
  }, [auth.user]);

  const value = useMemo(
    () => ({
      pendingJobList,
    }),
    [pendingJobList]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export { AdminContext, AdminContextProvider };
