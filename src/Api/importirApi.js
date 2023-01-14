import axios from 'axios'

export const get = async (data, param) => {
  let response = {}
  const baseUrl = `https://importir.com/api/belanja-co-id/${data}?token=syigdfjhagsjdf766et4wff6&${param}`
  // console.log(baseUrl, 'this is the url')
  const configurationObject = {
    url: baseUrl,
    method: 'GET',
  }

  try {
    // console.log('ini response')
    const resp = await axios(configurationObject)
    response = resp.data
    // console.log(response.data,'ini response')
  } catch (error) {
    console.log(error.message)
  }
  return response
}

export const getNew = async (data, type, param) => {
  let response = {}
  const baseUrl = `https://new-apiv2.importir.com/api/${data}/${type}?token=syigdfjhagsjdf766et4wff6&${param}`  

  const configurationObject = {
    url: baseUrl,
    method: 'GET',
  }

  try {
    // console.log('ini response')
    const resp = await axios(configurationObject)
    response = resp.data
    // console.log(response.data,'ini response')
  } catch (error) {
    console.log(error.message)
  }
  return response
}

export const viewSingleProduct = async (id, flag) => {
  let response = {}
  // const baseUrl=`https://dev-api-node.importir.com/api/products/${flag}/${id}?markup=40`
  const baseUrl = `https://new-api-node.importir.com/api/products/${flag}/${id}?markup=50`
  // console.log(baseUrl)
  const configurationObject = {
    url: baseUrl,
    method: 'GET',
  }

  try {
    // console.log('ini response')
    const resp = await axios(configurationObject)
    response = resp.data
    // console.log(response.data,'ini response')
  } catch (error) {
    console.log(error.message)
  }
  return response
}

export const postImportirAuth = async (data, type) => {
  let response = {}
  // const baseUrl=`https://dev-api.importir.com/api/belanja-co-id/${type}`
  const baseUrl = `https://new-apiv2.importir.com/api/belanja-co-id/${type}`
  const configurationObject = {
    url: baseUrl,
    method: 'POST',
    data: data,
  }

  try {
    const resp = await axios(configurationObject)
    response = resp.data
  } catch (error) {
    console.log(error.message)
  }
  return response
}

export const transactionImportir = async (data, auth) => {
  let response = {}
  // console.log(auth, 'this is the data')

  // const baseUrl=`https://dev-api.importir.com/api/blj-cart/store`
  const baseUrl = 'https://new-apiv2.importir.com/api/blj-cart/store'
  const configurationObject = {
    url: baseUrl,
    method: 'POST',
    data: data,
    headers: {
      Authorization: `Bearer ${auth}`,
    },
  }

  try {
    //   console.log(data,auth,'in axios')
    const resp = await axios(configurationObject)
    response = resp
    // console.log(resp,'ini response')
  } catch (error) {
    console.log(error.message)
  }
  return response
}

export const videoImportirProduct = async () => {
  let response = {}
  const baseUrl =
    'https://importir.com/api/belanja-co-id/product-video-list?token=syigdfjhagsjdf766et4wff6'
  const configurationObject = {
    url: baseUrl,
    method: 'GET',
  }

  try {
    const resp = await axios(configurationObject)
    response = resp.data
  } catch (error) {
    console.log(error.message)
  }
  return response
}