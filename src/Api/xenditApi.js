import axios from "axios";


//https://documenter.getpostman.com/view/16809780/UVyxRZY1#0fe17d65-dd9b-4454-8b9c-4985856cdf89
//staging = https://stage-payment.importir.com/

//create VA
//baseUrl/payment/xendit/platform/create-virtual-account' \
// va = bni,mandiri,permata,bca,bri


const staging = 'https://stage-payment.importir.com'
const production = 'https://payment.importir.com'

const config = {
  baseURL: production, // Ubah ke API production jika perlu
  timeout: 60 * 1000, // Timeout
};

export const createPaymentVA = (orderId,price)=>{
	const data = {
		"for_user_id":"6479f64913999eb3b3fe7283",
		"company" : "EPD",
		"external_id" : orderId,
		"expected_amount" : price,
		"bank_code" : "MANDIRI",
		"name" : "faizal"
	}

	return axios.post(`${config.baseURL}/payment/xendit/platform/create-virtual-account`,data)
	.then((x)=> x)
}