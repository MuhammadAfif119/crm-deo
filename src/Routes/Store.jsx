import { create } from "zustand";

const useUserStore = create((set, get) => ({
  //initial state
  // userDisplay: [],
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
  resetUserData: () => {
    set({
      taskData: {},
    });
  },
}));

export default useUserStore;
