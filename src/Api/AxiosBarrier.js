import axios from 'axios'
import store from 'store'


// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.post['Content-Type'] = 'application/json';


const config = {
  // baseURL: 'https://dev-api.importir.com',
  baseURL: 'https://new-apiv2.importir.com',
  timeout: 60 * 1000 // Timeout
}


const _axios = axios.create(config)


_axios.interceptors.request.use(async config => {

  let user = await store.get('userData')
  const userStorage = user&&user
  const token = userStorage.token

  if(userStorage){
    config.headers['Authorization'] = `Bearer ${ token }`
  }
  return config
}) 

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    response = typeof response.data !== 'undefined' ? response.data : response
    return response
  },
  
  function (error) {
    if (error.response.status===404) {
      // return window.location.href = '/error/error-404'
    }
    else if(error.response.status===401){
    //  return window.location.href = '/error/error-401'
    }
    console.log(error)
    return Promise.reject(error)
  }
)


export default _axios