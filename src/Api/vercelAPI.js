import axios from "axios";

const ApiVercel = axios.create({
  baseURL: "https://asia-southeast2-deoapp-indonesia.cloudfunctions.net/",
  // baseURL: "https://deoapp-docial-backend-y6he3ms5qq-uc.a.run.app/",
});

// ApiVercel.interceptors.request.use(config => {
//     config.headers.Authorization = `Bearer ${process.env.REACT_APP_VERCEL_API}`;
//     return config;
//   });

// export default ApiVercel;

export const deleteDomainCustom = async(domainName) => {
  const url = `https://asia-southeast2-deoapp-indonesia.cloudfunctions.net/vercelDeleteDomain`
  const configTest = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.REACT_APP_VERCEL_API
    },
    methods: "DELETE"
  }

  console.log("configtest", configTest)
  const newData = {
    domain_name: domainName,
    projectName: "domainview-react"
  }
  return axios.post(url, newData, configTest)
  .then((x) => x.status)
  .catch((err) => console.log(err))
}

export const addDomainCustom = async(domainName) => {
  const url = `https://asia-southeast2-deoapp-indonesia.cloudfunctions.net/vercelCreateDomain`
  const configTest = {
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': process.env.REACT_APP_VERCEL_API
    },
  }

  console.log("configtest", configTest)
  const newData = {
    domain_name: domainName
  }
  return axios.post(url, newData, configTest)
  .then((x) => x.data)
  .catch((err) => console.log(err))
}