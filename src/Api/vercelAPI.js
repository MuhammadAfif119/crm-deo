import axios from "axios";

const baseURL='https://asia-southeast2-deoapp-indonesia.cloudfunctions.net'
// const baseURL='http://localhost:5001/deoapp-indonesia/asia-southeast2'

// ApiVercel.interceptors.request.use(config => {
//     config.headers.Authorization = `Bearer ${process.env.REACT_APP_VERCEL_API}`;
//     return config;
//   });

// export default ApiVercel;

export const deleteDomainCustom = async(domainName, projectVercel = "domainview-react") => {
  const url = `${baseURL}/vercelDeleteDomain`
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
    projectName: projectVercel
  }
  return axios.post(url, newData, configTest)
  .then((x) => x.data)
  .catch((err) => console.log(err))
}

export const createDomainCustom = async(data) => {
  const url = `${baseURL}/vercelCreateDomain`
  const configTest = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.REACT_APP_VERCEL_API
    },
  }

  console.log("configtest", configTest)
  const newData = {
    domain_name: data.name,
    projectName: data.projectVercel
  }
  return axios.post(url, newData, configTest)
  .then((x) => x.data)
  .catch((err) => console.log(err))
}

export const checkDomainCustom = async(domainName, projectVercel = "domainview-react")=>{
	const url = `${baseURL}/vercelCheckDomain`
	const configtest = {headers : {
		'Content-Type': 'application/json',
		'Authorization': 'pFa08EJkVRoT7GDiqk1'}}
	const newData = {
		domain_name: domainName,
		projectName:projectVercel
	}
	return axios.post(url, newData, configtest)
		.then((x)=>x.data)
		.catch((err)=>console.log(err))
}