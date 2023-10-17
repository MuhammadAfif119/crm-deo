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
import { Stack, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import store from "store";
import Layout from "./Layouts";
import MainRouter from "./Router/MainRouter";
import AuthRouter from "./Router/AuthRouter";
import ChatPageFirst from "./Pages/Messanger/ChatPageFirst";
import LoadingOverlay from "./Components/Loader/LoadingOverlay";

function App() {
  const globalState = useUserStore();
  const toast = useToast();
  const navigate = useNavigate();

  const fetchProjectsAndCompanies = async (uid) => {
    const fetchCompanyId = localStorage.getItem("currentCompany");
    const fetchProjectId = localStorage.getItem("currentProject");

    const conditions = [
      {
        field: "users",
        operator: "array-contains",
        value: uid,
      },
    ];

    try {
      const [companies, projects] = await Promise.all([
        getCollectionFirebase("companies", conditions),
        getCollectionFirebase("projects", conditions),
      ]);

      if (!fetchCompanyId) {
        const userRoleInCompany = getUserRole(companies, uid);
        localStorage.setItem("currentCompany", companies[0]?.id);
        globalState.setCompanies(companies);
        globalState.setCurrentCompany(companies[0]?.id);
        globalState.setCurrentXenditId(companies[0]?.xenditId);
        globalState.setRoleCompany(userRoleInCompany);
      } else {
        globalState.setCurrentCompany(fetchCompanyId);
        const userRoleInCompany = getUserRole(companies, uid);
        globalState.setCompanies(companies);
        globalState.setCurrentXenditId(companies[0]?.xenditId);
        globalState.setRoleCompany(userRoleInCompany);
      }

      if (!fetchProjectId) {
        if (companies[0]?.id) {
          const userRoleInProject = getUserRole(projects, uid);
          localStorage.setItem("currentProject", projects[0]?.id);
          globalState.setProjects(projects);
          globalState.setCurrentProject(projects[0]?.id);
          globalState.setRoleProject(userRoleInProject);
        }
      } else {
        const userRoleInProject = getUserRole(projects, uid);
        globalState.setProjects(projects);
        globalState.setCurrentProject(fetchProjectId);
        globalState.setRoleProject(userRoleInProject);
      }
    } catch (error) {
      console.log(error, "ini err");
    }
  };

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
        description: "Loggedout success",
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

  return (
    <Stack position={"relative"} overflow="hidden">
      {globalState.isLoggedIn ? (
        <Layout>
          {globalState.isLoading ? (
            <>
            <LoadingOverlay />
            <MainRouter />
            </>
          ):(
            
            <MainRouter />
          )}
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
