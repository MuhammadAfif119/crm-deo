import { useEffect, useState } from "react";


import Layout from "./Layouts";
import MainRouter from "./Router/MainRouter";
import AuthRouter from "./Router/AuthRouter";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Config/firebase";
import { getCollectionFirebase } from "./Api/firebaseApi";
import useUserStore from "./Hooks/Zustand/Store";

function App() {

  const globalState = useUserStore();



  const fetchProjectsAndCompanies = async (uid) => {
    const conditions = [
      {
        field: "users",
        operator: "array-contains",
        value: uid,
      },
    ];

    try {
      const projects = await getCollectionFirebase("projects", conditions);
      const companies = await getCollectionFirebase("companies", conditions);



      globalState.setProjects(projects);
      globalState.setCurrentProject(projects[0]?.id);

      if (projects.length > 0 && projects[0].owner?.includes(uid)) {
        globalState.setRoleProject("owner");
      } else if (projects.length > 0 && projects[0].managers?.includes(uid)) {
        globalState.setRoleProject("managers");
      } else {
        globalState.setRoleProject("user");
      }

      globalState.setCompanies(companies);
      globalState.setCurrentCompany(companies[0]?.id);
      globalState.setCurrentXenditId(companies[0]?.xenditId);

      if (companies.length > 0 && companies[0].owner?.includes(uid)) {
        globalState.setRoleCompany("owner");
      } else if (companies.length > 0 && companies[0].managers?.includes(uid)) {
        globalState.setRoleCompany("managers");
      } else {
        globalState.setRoleCompany("user");
      }



    } catch (error) {
      console.log(error, "ini error");
    }
  };

  useEffect(() => {

    onAuthStateChanged(auth, (user) => {
      if (user) {
        globalState.setIsLoggedIn(true);
        globalState.setUid(user.uid);
        globalState.setName(user.displayName);
        globalState.setEmail(user.email);
        fetchProjectsAndCompanies(user?.uid);
      } else {
        globalState.setIsLoggedIn(false);
      }
    });

    return () => {};
  }, []);


  return (
    <>

     {globalState.isLoggedIn ? (
        <Layout>
          <MainRouter />
        </Layout>
       ) : (
        <AuthRouter />
       )}
    </>
  );
}

export default App;
