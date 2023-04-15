//http://fetchrss.com/api/v1/feed/create?auth=60e713994f45d117352e9e72.1sJg0ZbZW0TbOJFxw&url=https%3A%2F%2Fwww.youtube.com%2Fc%2Fvsauce1

import axios from 'axios'

export const createRssFetch = async (url) => {
  let response = {}
  const baseUrl = `http://fetchrss.com/api/v1/feed/create?auth=60e713994f45d117352e9e72.1sJg0ZbZW0TbOJFxw&url=https%3A%2F%2Fwww.youtube.com%2Fc%2Fvsauce1`
  const configurationObject = {
    url: baseUrl,
    method: 'GET',

  }

  try {
    //   console.log(data,auth,'in axios')
    const resp = await axios(configurationObject)
    response = resp
    console.log(resp,'ini response')
  } catch (error) {
    console.log(error.message)
  }
  return response
}
