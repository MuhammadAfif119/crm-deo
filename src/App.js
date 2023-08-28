import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, fetchToken } from "./Config/firebase";
import {
  arrayUnionFirebase,
  getCollectionFirebase,
  getSingleDocumentFirebase,
} from "./Api/firebaseApi";
import useUserStore from "./Hooks/Zustand/Store";
import { decryptToken } from "./Utils/encrypToken";
import {
  logoutIfExpired,
  logoutUserWithIp,
} from "./Hooks/Middleware/sessionMiddleWare";
import { removeSymbols } from "./Utils/Helper";
import { Stack, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import store from "store";
import Layout from "./Layouts";
import MainRouter from "./Router/MainRouter";
import AuthRouter from "./Router/AuthRouter";
import ChatPageFirst from "./Pages/Messanger/ChatPageFirst";

function App() {
  const globalState = useUserStore();
  const toast = useToast();
  const navigate = useNavigate();

  // const fetchProjectsAndCompanies = async (uid) => {
  //   const fetchCompanyId = localStorage.getItem('currentCompany')
  //   const fetchProjectId = localStorage.getItem('currentProject')
    
  //   const conditions = [
  //     {
  //       field: "users",
  //       operator: "array-contains",
  //       value: uid,
  //     },
  //   ];

  //   const [companies, projects] = await Promise.all([
  //     getCollectionFirebase("companies", conditions),
  //     getCollectionFirebase("projects", conditions),
  //   ]);

  //   if(!fetchCompanyId && !fetchProjectId){
  //     try {
  //       console.log('ga ada company')
        
  
  //       const userRoleInCompany = getUserRole(companies, uid);
  //       globalState.setCompanies(companies);
  //       globalState.setCurrentCompany(companies[0]?.id);
  //       globalState.setCurrentXenditId(companies[0]?.xenditId);
  //       globalState.setRoleCompany(userRoleInCompany);
  
  //       if (companies[0]?.id) {
  //         const userRoleInProject = getUserRole(projects, uid);
  //         globalState.setProjects(projects);
  //         globalState.setCurrentProject(projects[0]?.id);
  //         globalState.setRoleProject(userRoleInProject);
  //       }
  //     } catch (error) {
  //       console.log(error, "ini err");
  //     }
  //   } else {
  //     console.log('ada company')
      
  //     const userRoleInCompany = getUserRole(companies, uid);
  //       globalState.setCompanies(companies);
  //       globalState.setCurrentCompany(fetchCompanyId);
  //       globalState.setCurrentXenditId(companies[0]?.xenditId);
  //       globalState.setRoleCompany(userRoleInCompany);
  
  //       if (companies[0]?.id) {
  //         const userRoleInProject = getUserRole(projects, uid);
  //         globalState.setProjects(projects);
  //         globalState.setCurrentProject(fetchProjectId);
  //         globalState.setRoleProject(userRoleInProject);
  //       }

  //       console.log(globalState.currentCompany, 'COMPANYYYY')
  //       console.log(globalState.currentProject, 'PROJECTTT')

  //   }
    
  // };

  const fetchProjectsAndCompanies = async (uid) => {
    const fetchCompanyId = localStorage.getItem('currentCompany')

    const conditions = [
      {
        field: "users",
        operator: "array-contains",
        value: uid,
      },
    ];

     // const projects = await getCollectionFirebase("projects", conditions);
     const companies = await getCollectionFirebase("companies", conditions);

    if(!fetchCompanyId){
      try {
      const userRoleInCompany = getUserRole(companies, uid);

        globalState.setCompanies(companies);
        globalState.setCurrentCompany(companies[0]?.id);
        globalState.setCurrentXenditId(companies[0]?.xenditId);
        localStorage.setItem('currentCompany', companies[0]?.id)
        globalState.setRoleCompany(userRoleInCompany);

        console.log(globalState.currentXenditId, 'gaada company localstorage')
  

  
      } catch (error) {
        console.log(error, "ini error");
      }
    } else {

      const getCompanies = await getSingleDocumentFirebase("companies", fetchCompanyId)
      const userRoleInCompany = getUserRole(companies, uid);

        globalState.setCompanies(companies);
        globalState.setCurrentCompany(fetchCompanyId);
        globalState.setCurrentXenditId(getCompanies?.xenditId);
        globalState.setRoleCompany(userRoleInCompany);


       

    }
  };

  const fetchProjects = async(uid) => { 
    const fetchProjectId = localStorage.getItem('currentProject')

    const conditions = [
      {
        field: "users",
        operator: "array-contains",
        value: uid,
      },
      {
        field: "companyId",
        operator: "==",
        value: globalState.currentCompany,
      },
    ];
    
    const projects = await getCollectionFirebase("projects", conditions);

    if(!fetchProjectId){
      try {
        const userRoleInCompany = getUserRole(projects, uid);

        globalState.setProjects(projects);
        localStorage.setItem('currentProject', projects[0]?.id)
        globalState.setCurrentProject(projects[0]?.id);
        globalState.setRoleProject(userRoleInCompany);
        
  
        // if (projects.length > 0 && projects[0].owner?.includes(uid)) {
        //   globalState.setRoleProject("owner");
        // } else if (projects.length > 0 && projects[0].managers?.includes(uid)) {
        //   globalState.setRoleProject("managers");
        // } else {
        //   globalState.setRoleProject("user");
        // }

        
      } catch (error) {
        console.log(error, 'ini error');
      }
    } else {
      const getProjects = await getSingleDocumentFirebase("projects", fetchProjectId)
      
      const userRoleInCompany = getUserRole(projects, uid);

        globalState.setProjects(projects);
        localStorage.setItem('currentProject', projects[0]?.id)
        globalState.setCurrentProject(fetchProjectId);

        globalState.setRoleProject(userRoleInCompany);
        
    }
    
  }

  const getUserRole = (data, uid) => {
    if (data.length > 0 && data[0].owner?.includes(uid)) {
      return "owner";
    } else if (data.length > 0 && data[0].managers?.includes(uid)) {
      return "managers";
    } else {
      return "user";
    }
  };

  const uploadTokenToFirebase = async (token, user) => {
    if (token !== "") {
      const collectionName = "users";
      const docName = user.uid;
      const field = "tokenId";
      const values = [token];

      try {
        await arrayUnionFirebase(collectionName, docName, field, values);
      } catch (error) {
        console.log("Terjadi kesalahan:", error);
      }
    }
  };

  const getAccessToken = async () => {
    try {
      const result = await getSingleDocumentFirebase("token", "dropbox");
      const resultData = decryptToken(result?.access_token);
      globalState.setAccessToken(resultData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    const pathLink = "crm";

    try {
      await logoutUserWithIp(
        window.location.hostname,
        globalState.email,
        pathLink
      );
      await signOut(auth);
      toast({
        status: "success",
        description: "Logged out success",
        duration: 2000,
      });
    } catch (error) {
      console.log(error, "ini error");
    } finally {
      globalState.setIsLoggedIn(false);
      store.clearAll();
      navigate("/login");
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const pathLink = "crm";
        const res = await logoutIfExpired(
          window.location.hostname,
          user?.email,
          pathLink
        );

        if (res) {
          handleLogout();
        } else {
          const token = await fetchToken();
          if (token) {
            await uploadTokenToFirebase(token, user);
          }
          await getAccessToken();

          globalState.setIsLoggedIn(true);
          globalState.setUid(user.uid);
          globalState.setName(user.displayName);
          globalState.setEmail(user.email);
          fetchProjectsAndCompanies(user?.uid);
        }
      } else {
        globalState.setIsLoggedIn(false);
      }
    });

    return () => {};
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchProjects(user?.uid);
      } else {
        globalState.setIsLoggedIn(false);
      }
    });
  
    return () => {
    }
  }, [globalState.currentCompany])

  return (
    <Stack position={"relative"} overflow='hidden'>
      {globalState.isLoggedIn ? (
        <Layout>
          <MainRouter />
        </Layout>
      ) : (
        <AuthRouter />
      )}
      <Stack position={"absolute"} bottom={5} right={5}>
          <ChatPageFirst
            module={"crm"}
            companyId={globalState?.currentCompany || "8NCG4Qw0xVbNR6JCcJw1"}
            projectId={globalState?.currentProject || "8NCG4Qw0xVbNR6JCcJw1"}
            companyName={"edrus"}
          />
      </Stack>
    </Stack>
  );
}

export default App;
