import { collection, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";
import { create } from "zustand";
import { db } from "../Config/firebase";

const useUserStore = create((set, get) => ({
  //initial state
  // userDisplay: [],
  storage: {},
  currentUser: null,
  userObject: {},
  userDisplay: {
    companies: [],
    projects: [],
    currentCompany: "",
    profileKey: "",
    currentProject: "",
    uid: "",
  },
  companies: [],
  projects: [],
  functionAddData: function () {},

  //function dispatch reducer
  setUserDisplay: (data) => {
    set({
      ...get().userDisplay,
      userDisplay: data,
    });
  },
  setUserObject: (data) => {
    set({
      userObject: {
        ...get().userObject,
        ...data,
      },
    });
  },
  setUserCompany: (data) => {
    set({
      userObject: {
        ...get().userObject,
        ...data,
      },
    });
  },
  setUserProject: (data) => {
    set({
      userObject: {
        ...get().userObject,
        ...data,
      },
    });
  },
  setFunctionAddData: (func) => {
    set({
      setData: func,
    });
  },
  setStorage: (func) => {
    set({
      setData: func,
    });
  },
  resetUserData: () => {
    set({
      taskData: {},
    });
  },
}));

export default useUserStore;

// export const getCompany = create((set, get) => {
//   const [company, setCompany] = useState()

//   try {
//     let collectionRef = query(
//       collection(db, "companies"),
//       where("users", "array-contains", currentUser.uid)
//     );
//     const querySnapshot = getDocs(collectionRef);
//     const collectionData = [];
//     querySnapshot.forEach((doc) => {
//       const docData = doc.data();
//       // Lakukan manipulasi data atau operasi lain jika diperlukan
//       collectionData.push({ id: doc.id, data: docData });
//     });
//     setCompany(collectionData);
//   } catch (error) {
//     console.log("Terjadi kesalahan:", error);
//   }
// });
