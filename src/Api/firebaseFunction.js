import axios from "axios"
const options={
	headers : {
	'Content-Type': 'application/json',
	'Authorization': process.env.REACT_APP_PAYMENT_KEY
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