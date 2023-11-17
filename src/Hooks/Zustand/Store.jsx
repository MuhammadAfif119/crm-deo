import { create } from "zustand";

const companyItem = localStorage.getItem("currentCompany");
const pojectItem = localStorage.getItem("currentProject");

console.log(companyItem, "ini company");

const useUserStore = create((set, get) => ({
  isLoggedIn: false,
  isLoading: false,
  companies: [],
  projects: [],
  currentCompany: companyItem || "",
  currentProject: pojectItem || "",
  profileKey: "",
  uid: "",
  name: "",
  email: "",
  currentXenditId: "",
  roleCompany: "",
  roleProject: "",
  users: [],
  accessToken: "",
  dataCompanyId: "",

  setDataCompanyId: (data) => {
    set({
      dataCompanyId: data,
    });
  },
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

  setIsLoading: (data) => {
    set({
      isLoading: data,
    });
  },

  setCompanies: (data) => {
    set({
      companies: data,
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
