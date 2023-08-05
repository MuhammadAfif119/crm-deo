import { useEffect } from "react";
import Layout from "./Layouts";
import MainRouter from "./Router/MainRouter";
import AuthRouter from "./Router/AuthRouter";
import { onAuthStateChanged } from "firebase/auth";
import { auth, fetchToken } from "./Config/firebase";
import { arrayUnionFirebase, getCollectionFirebase, getSingleDocumentFirebase } from "./Api/firebaseApi";
import useUserStore from "./Hooks/Zustand/Store";
import { loginUserWithIp } from "./Hooks/Middleware/sessionMiddleWare";
import { decryptToken } from "./Utils/encrypToken";

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
      const [companies, projects] = await Promise.all([
        getCollectionFirebase("companies", conditions),
        getCollectionFirebase("projects", conditions),
      ]);

      globalState.setCompanies(companies);
      globalState.setCurrentCompany(companies[0]?.id);
      globalState.setCurrentXenditId(companies[0]?.xenditId);

      const userRoleInCompany = getUserRole(companies, uid);
      globalState.setRoleCompany(userRoleInCompany);

      if (companies[0]?.id) {
        globalState.setProjects(projects);
        globalState.setCurrentProject(projects[0]?.id);

        const userRoleInProject = getUserRole(projects, uid);
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
        console.log(token, "ini token"); // Pesan toast yang berhasil
      } catch (error) {
        console.log("Terjadi kesalahan:", error);
      }
    }
  };

  const getAccessToken = async () => {
        try {
          const result = await getSingleDocumentFirebase('token', 'dropbox')
          const resultData = decryptToken(result.access_token)
          globalState.setAccessToken(resultData);

        } catch (error) {
          console.log(error)
        }
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
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
