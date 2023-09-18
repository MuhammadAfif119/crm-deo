import axios from 'axios'
import React from 'react'

//cek ongkir dari rajaOngkir

const baseURL = 'https://pro.rajaongkir.com/api';

export const provinceList = async (data) => {
  const apiKey = process.env.REACT_APP_SHIPPING_RAJAONGKIR;

  const options = {
    method: 'get',
    url: `${baseURL}/province`,
    params: {
      id: '6',
    },
    headers: {
      key: apiKey,
    },
  };

  try {
    const response = await axios(options);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const cityList = async(data) => {
    const url = `${baseURL}/city`
    const configTest = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.REACT_APP_SHIPPING_RAJAONGKIR
      },
    }
  
    
    const newData = {
      id: data.id,
    }
    
    return axios.post(url, newData, configTest)
    .then((x) => x.data)
    .catch((err) => console.log(err))
  }