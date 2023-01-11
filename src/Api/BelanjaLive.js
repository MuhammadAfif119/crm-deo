import axios from 'axios'

export const belanjalive = async (params, auth) => {
  let response = {}
  // console.log(auth, 'this is the data')

  const baseUrl = `https://belanja-live-backend-ojzdfl2axa-uc.a.run.app/${params}`
  const configurationObject = {
    url: baseUrl,
    method: 'GET',
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
