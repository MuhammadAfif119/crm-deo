import { create } from "zustand";

const useUserStore = create((set, get) => ({
  isLoggedIn: false,
  companies: [],
  projects: [],
  currentCompany: "",
  profileKey: "",
  currentProject: "",
  uid: "",
  name: "",
  email: "",
  currentXenditId: "",
  roleCompany: "",
  roleProject: "",
  users: [],
  accessToken: "",
  chatId: 0,

  setUid: (data) => {
    set({
      uid: data,
    });
  },

  setName: (data) => {
    set({
      name: data,
    });
  },

  setEmail: (data) => {
    set({
      email: data,
    });
  },

  setIsLoggedIn: (data) => {
    set({
      isLoggedIn: data,
    });
  },

  setCompanies: (data) => {
    set({
      companies: data,
    });
  },

  setChatId: (data) => {
    set({
      chatId: data,
    });
  },

  setCurrentCompany: (data) => {
    set({
      currentCompany: data,
    });
  },

  setProjects: (data) => {
    set({
      projects: data,
    });
  },

  setCurrentProject: (data) => {
    set({
      currentProject: data,
    });
  },

  setRoleCompany: (data) => {
    set({
      roleCompany: data,
    });
  },

  setRoleProject: (data) => {
    set({
      roleProject: data,
    });
  },

  setCurrentXenditId: (data) => {
    set({
      currentXenditId: data,
    });
  },

  setUsers: (data) => {
    set({
      users: data,
    });
  },
  setAccessToken: (data) => {
    set({
      accessToken: data,
    });
  },
}));

export default useUserStore;
