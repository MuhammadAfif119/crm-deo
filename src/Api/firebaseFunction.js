import axios from "axios"

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