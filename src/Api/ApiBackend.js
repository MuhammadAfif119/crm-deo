import axios from "axios";

const ApiBackend = axios.create({
  baseURL: "http://localhost:8080/",
  // baseURL: "https://deoapp-docial-backend-y6he3ms5qq-uc.a.run.app/",
});
export default ApiBackend;
