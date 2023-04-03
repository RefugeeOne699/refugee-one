import {
  collection,
  doc,
  getCountFromServer,
  getDocs,
  query,
  // eslint-disable-next-line no-unused-vars
  QueryConstraint,
  runTransaction,
} from "firebase/firestore";
import { createContext, useMemo } from "react";

import database from "@/clients/firebase";
import { JOB_STATUS } from "@/constants";

// All just a copu of job.jsx more or less

const UserContext = createContext({
  approveUser: () => {},
  deleteUser: () => {},
  listUsers: (_queryConstraints) => [],
  countUsers: (_queryConstraints) => Number,
});

const updateUser = async (userId, payload) => {

  if (payload.id) {
    delete payload.id;
  }

  await runTransaction(database, async (transaction) => {
    const userDocRef = doc(database, "Users", userId);
    const userDoc = await transaction.get(userDocRef);
    if (!userDoc.exists()) {
      throw `User ${userId} does not exist`;
    }
    transaction.update(userDocRef, payload);
  });
};

const approveUser = async (userId) => {
  await updateUser(userId, { status: JOB_STATUS.APPROVED });
};


const UserContextProvider = ({ children }) => {

  const listUsers = async (queryConstraints) => {
    const userCollection = collection(database, "Users");
    const userQuery = queryConstraints
      ? query(userCollection, queryConstraints)
      : userCollection;
    const userDocs = await getDocs(userQuery);
    const userList = userDocs.docs.map(async (doc) => {
      const user = doc.data();
      return {
        id: doc.id,
        company: user.company,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        status: user.status ? user.status : JOB_STATUS.PENDING
      };
    });
    return await Promise.all(userList);
  };

  const countUsers = async (queryConstraints) => {
    const userCollection = collection(database, "Users");
    const userQuery = queryConstraints
      ? query(userCollection, queryConstraints)
      : userCollection;
    const snapshot = await getCountFromServer(userQuery);
    return snapshot.data().count;
  };

  const value = useMemo(
    () => ({
      updateUser,
      approveUser,
      // todo
      deleteUser: () => {},
      listUsers,
      countUsers,
    }),
    []
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export { UserContext, UserContextProvider };
