import { useEffect, useState } from "react";

import Layout from "./Layouts";
import MainRouter from "./Router/MainRouter";
import AuthRouter from "./Router/AuthRouter";
import { onAuthStateChanged } from "firebase/auth";
import { auth, fetchToken } from "./Config/firebase";
import { arrayUnionFirebase, getCollectionFirebase } from "./Api/firebaseApi";
import useUserStore from "./Hooks/Zustand/Store";

function App() {
  const globalState = useUserStore();

  const [tokenId, setTokenId] = useState("");

  const fetchProjectsAndCompanies = async (uid) => {
    const conditions = [
      {
        field: "users",
        operator: "array-contains",
        value: uid,
      },
    ];

    try {
      const companies = await getCollectionFirebase("companies", conditions);
      // const projects = await getCollectionFirebase("projects", conditions);

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


      if(companies[0]?.id){
        return getProjectData(companies[0]?.id, uid)
      }

    } catch (error) {
      console.log(error, "ini err");
    }
  };

  const getProjectData = async (id, uid) => {

    const conditions = [
      {
        field: "users",
        operator: "array-contains",
        value: uid,
      },
      {
        field: "companyId",
        operator: "==",
        value: id,
      },
    ];


    try {

      const projects = await getCollectionFirebase("projects", conditions);


      globalState.setProjects(projects);
      globalState.setCurrentProject(projects[0]?.id);

      if (projects.length > 0 && projects[0].owner?.includes(uid)) {
        globalState.setRoleProject("owner");
      } else if (projects.length > 0 && projects[0].managers?.includes(uid)) {
        globalState.setRoleProject("managers");
      } else {
        globalState.setRoleProject("user");
      }

      
    } catch (error) {
      console.log(error, 'ini error')
    }
  }

  const uploadTokenToFirebase = async (token, user) => {
    if (token !== "") {
      const collectionName = "users";
      const docName = user.uid;
      const field = "tokenId";
      const values = [token];

      try {
        const result = await arrayUnionFirebase(
          collectionName,
          docName,
          field,
          values
        );
        console.log(result, token, 'ini token'); // Pesan toast yang berhasil
      } catch (error) {
        console.log("Terjadi kesalahan:", error);
      }
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await fetchToken();
        uploadTokenToFirebase(token, user);
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
