import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

export const fetchJobs = async (database, role, uid) => {
  // https://firebase.google.com/docs/firestore/query-data/queries
  // https://firebase.google.com/docs/auth/web/manage-users
  // https://stackoverflow.com/questions/47743082/waiting-for-a-foreach-to-finish-before-return-from-my-promise-function

  const jobOpenings = collection(database, "Jobs");
  let q;
  if(role === "Admin"){
    q = jobOpenings
  }else if(role === "Employer"){
    q = query(jobOpenings, where("owner", "==", doc(database, "Users", uid)))
  }else{
    q = query(jobOpenings, where("status", "==","pending"))
  }
  const querySnapshot = await getDocs(q);
  const jobList = [];
  const owners = [];
  querySnapshot.forEach((doc) => {
    const data = {...doc.data(), id: doc.id};
    owners.push(getDoc(data.owner));
    jobList.push(data);
  });
  const companies = [];
  const retrievedOwners = await Promise.all(owners);
  retrievedOwners.forEach((owner, i) => {
    const parsedOwner = owner.data();
    jobList[i].parsedOwner = parsedOwner;
    companies.push(getDoc(parsedOwner.company));
  });
  const retrievedCompanies = await Promise.all(companies);
  retrievedCompanies.forEach((company, i) => {
    const parsedCompany = company.data();
    jobList[i].parsedCompany = parsedCompany;
  });
  return jobList;
};
