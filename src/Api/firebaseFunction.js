import axios from "axios"

const baseURL='https://asia-southeast2-deoapp-indonesia.cloudfunctions.net'
// const baseURL='http://localhost:5001/deoapp-indonesia/asia-southeast2'

const options={
	headers : {
	'Content-Type': 'application/json',
	'Authorization': 'q1w2e3r4t5y6u7i8o9p0'
}}
export const uploadImage = async(file) => {
	const configTest = {
		headers: {
			"Content-Type": "multipart/form-data",
		}
	}

	const bodyParam = {
		"file": file,
		"email" : "deoadmin@deoapp.com"
	}

	const uploadImageRes = await axios.post("https://new-admin.importir.com/api/general/upload-image", bodyParam, configTest);
	return uploadImageRes;
}

export const createUserFunctions =async(data)=>{
	try {
		console.log('create user functions')
		const newUrl = "https://asia-southeast2-deoapp-indonesia.cloudfunctions.net/createUser"
		const resultPost = (await axios.post(newUrl,data,options)).data
		console.log("resultPost", resultPost)
		return resultPost
	} catch(error) {
		console.log('createUserFunctions', error)
		return {
			status: false,
			message: `Err code catch FF-CUF: ${error}`
		}
	}
}	

export const initOauth = async(data)=>{
	const url = `${baseURL}/analyticInitOauth`
	const configtest = {"headers" : {
		'Content-Type': 'application/json',
		'Authorization': 'pFa08EJkVRoT7GDiqk1'}}
	return axios.post(url, data, configtest)
		.then((x)=>x.data)
		.catch((err)=>console.log(err))
}


export const createSource = async(data)=>{
	const url = `${baseURL}/analyticCreateSourceAndConnection`
	const configtest = {headers : {
		'Content-Type': 'application/json',
		'Authorization': 'pFa08EJkVRoT7GDiqk1'}}
	return axios.post(url, data, configtest)
		.then((x)=>x.data)
		.catch((err)=>console.log(err))
}

export const deleteSource = async(sourceId, name)=>{
	const url = `${baseURL}/analyticDeleteSource`
	const configtest = {headers : {
		'Content-Type': 'application/json',
		'Authorization': 'pFa08EJkVRoT7GDiqk1',
		methods: "DELETE"
	}}
	return axios.post(url, {
		"source_id": sourceId,
		"source_name": name
	}, configtest)
		.then((x)=>x.data)
		.catch((err)=>console.log(err))
}


export const updateSource = async(data)=>{
	const url = `${baseURL}/analyticUpdateSourceAndConnection`
	const configtest = {headers : {
		'Content-Type': 'application/json',
		'Authorization': 'pFa08EJkVRoT7GDiqk1'}}
	return axios.post(url, data, configtest)
		.then((x)=>x.data)
		.catch((err)=>console.log(err))
}

export const updateSecretId = async(data)=>{
	const url = `${baseURL}/analyticUpdateSecretId`
	const configtest = {headers : {
		'Content-Type': 'application/json',
		'Authorization': 'pFa08EJkVRoT7GDiqk1'}}
	return axios.post(url, data, configtest)
		.then((x)=>x.data)
		.catch((err)=>console.log(err))
}