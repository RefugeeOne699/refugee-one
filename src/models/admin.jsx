import {
  collection,
  doc,
  getCountFromServer,
  getDocs,
  query,
  // eslint-disable-next-line no-unused-vars
  runTransaction,
} from "firebase/firestore";
import { createContext, useMemo } from "react";
import { Navigate } from "react-router-dom";

import database from "@/clients/firebase";
import { ROLES, USER_STATUS } from "@/constants";

import { useAuth } from ".";

const AdminContext = createContext({
  approveUser: () => {},
  updateUser: () => {},
  deleteUser: () => {},
  listUsers: (_queryConstraints) => [],
  countUsers: (_queryConstraints) => Number,
});

const AdminContextProvider = ({ children }) => {
  const auth = useAuth();
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
        // to deal with existing accounts who don't have status field
        status: user.status || USER_STATUS.PENDING,
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

  const approveUser = async (userId, user) => {
    // Approve an employer account, send to his email the password reset email as to notify him the approval
    if (user.role === ROLES.EMPLOYER) {
      await updateUser(userId, { status: USER_STATUS.APPROVED });
      await auth.resetPassWordByEmail(user.email);
    }
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

  return (
    <RequireAdmin>
      <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
    </RequireAdmin>
  );
};

const RequireAdmin = ({ children }) => {
  const auth = useAuth();
  if (auth.user.role === ROLES.ADMIN) {
    return children;
  } else {
    // todo: add an error page for non-admin access
    return <Navigate to="/" replace />;
  }
};

export { AdminContext, AdminContextProvider };
