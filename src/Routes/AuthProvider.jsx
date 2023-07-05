import { useToast } from "@chakra-ui/react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, fetchToken } from "../Config/firebase";
import AuthContext from "./hooks/AuthContext";
import store from "store";
import { getNew, postImportirAuth } from "../Api/importirApi";
import _axios from "../Api/AxiosBarrier";
import { get } from "../Api/importirApi";
import ApiBackend from "../Api/ApiBackend";
import useUserStore from "./Store";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState("");
  const [company, setCompany] = useState([]);
  const [tokenId, setTokenId] = useState("");
  const [loading, setLoading] = useState(false);
  const [userStorage, setUserStorage] = useState();
  const { setUserObject, setStorage } = useUserStore();

  const navigate = useNavigate();
  const toast = useToast();

  const login = (email, password) => {
    loadingShow();
    return signInWithEmailAndPassword(auth, email, password)
      .then(async (response) => {
        const user = response.user;
        setUserObject(user);
        if (user) {
          try {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              if (docSnap?.data()?.ayrshare_account?.profileKey) {
                const res = await ApiBackend.post("/generateJWT", {
                  domain: "importir",
                  profileKey: docSnap.data().ayrshare_account.profileKey,
                });
                if (res.status === 200) {
                  await updateDoc(docRef, { token_ayrshare: res.data.token });
                  // console.log('test')

                  await updateDoc(docRef, { tokenId: arrayUnion(tokenId) });

                  await store.set("userData", docSnap.data());
                }
              } else {
                await updateDoc(docRef, { tokenId: arrayUnion(tokenId) });

                await store.set("userData", docSnap.data());
              }
            } else {
              console.log("No such document!");
            }
            // getCart()
            loadingClose();
          } catch (error) {
            console.log(error, "ini error");
            loadingClose();
          }
        }

        toast({
          title: "Success Login",
          description: `Success Login account ${response.user.displayName} `,
          status: "success",
          duration: 10000,
          isClosable: true,
          position: "top-right",
        });

        return navigate("/");
      })
      .catch((error) => {
        toast({
          title: "Something wrong !",
          description: error.message,
          status: "error",
          duration: 10000,
          isClosable: true,
          position: "top-right",
        });
        loadingClose();
      });
  };

  const signOut = () => {
    return auth.signOut();
  };

  const getUserStorage = async () => {
    if (currentUser) {
      try {
        const res = await store.get("userData");
        setUserStorage(res);
        setStorage(res);
      } catch (error) {
        console.log(error, "error");
      }
    }
    return userStorage;
  };

  const signUp = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const getUser = () => {
    return auth.currentUser;
  };

  const loadingShow = () => {
    setLoading(true);
  };

  const loadingClose = () => {
    setLoading(false);
  };

  // const getCompany = async () => {
  //   try {
  //     const q = query(
  //       collection(db, "companies"),
  //       where("users", "array-contains", currentUser.uid)
  //     );
  //     const companyArray = [];

  //     const querySnapshot = await getDocs(q);
  //     querySnapshot.forEach((doc) => {
  //       // doc.data() is never undefined for query doc snapshots
  //       companyArray.push({ id: doc.id, data: doc.data() });
  //     });
  //     setCompany(companyArray);
  //     console.log(companyArray);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const getCompany = async () => {
    try {
      // const companyRef = db.collection("companies");
      // const query = companyRef.where(
      //   "users",
      //   "array-contains",
      //   currentUser.uid
      // );

      // query.get().then((querySnapshot) => {
      //   querySnapshot.forEach((doc) => {
      //     // Access the document data
      //     setCompany("Company:", doc.id, doc.data());
      //   });
      // });

      console.log(currentUser.uid);

      const collectionRef = query(
        collection(db, "companies"),
        where("owners", "array-contains", currentUser?.uid)
      );
      const querySnapshot = await getDocs(collectionRef);
      console.log(querySnapshot);
      const collectionData = [];
      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        // Lakukan manipulasi data atau operasi lain jika diperlukan
        collectionData.push({ id: doc.id, data: docData });
      });
      setCompany(collectionData);
      console.log(collectionData);
      console.log(company);
    } catch (error) {
      console.log("Terjadi kesalahan:", error);
    }
  };

  console.log(currentUser?.uid);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      fetchToken(setTokenId);
    });
  }, []);

  useEffect(() => {
    getUserStorage();
    getCompany();

    return () => {};
  }, [currentUser]);

  const value = {
    currentUser,
    tokenId,
    company,
    getUser,
    getCompany,
    login,
    signOut,
    signUp,
    getUserStorage,
    userStorage,
    loadingShow,
    loadingClose,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
