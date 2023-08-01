import axios from "axios";

const config = {
  // baseURL: 'https://dev-api.importir.com', // Ubah ke API staging jika perlu
  baseURL: "https://asia-southeast2-deoapp-indonesia.cloudfunctions.net", // Ubah ke API production jika perlu
  timeout: 60 * 1000, // Timeout
};

const axiosInstance = axios.create(config);

axiosInstance.interceptors.response.use(
  function (response) {
    // Lakukan sesuatu dengan data response
    response = typeof response.data !== "undefined" ? response.data : response;
    return response;
  },

  function (error) {
    if (error.response.status === 404) {
      // return window.location.href = '/error/error-404'
    } else if (error.response.status === 401) {
      //  return window.location.href = '/error/error-401'
    }
    console.log(error);
    return Promise.reject(error);
  }
);

export default axiosInstance;

// EXAMPLE CALL API

export const getDataApi = async () => {
  try {
    const res = await axiosInstance.get("/api/");
    console.log(res.data, "ini res");
    return res.data;
  } catch (error) {
    console.log(error, "ini error");
  }

  return;
};

// Example Get Data

// const getData = async () => {
//     try {
//         const response = await getDataApi('/api/');
//         console.log(response);
//         // Lakukan sesuatu dengan data response
//       } catch (error) {
//         console.log(error);
//         // Tangani error dengan cara yang sesuai
//       }
// }

// Finish

export const postDataApi = async (data) => {
  try {
    const res = await axiosInstance.post("/api/", data);
    console.log(res.data, "ini res");
    return res.data;
  } catch (error) {
    console.log(error, "ini error");
  }
};

// Example post data

// const postData = async () => {
//   const newData = { name: "John Doe", age: 30 };
//   try {
//     const response = await postDataApi("/api/", newData);
//     console.log(response);
//     // Lakukan sesuatu dengan data response
//   } catch (error) {
//     console.log(error);
//     // Tangani error dengan cara yang sesuai
//   }
// };
// //Finish

export const deleteDataApi = async (id) => {
  try {
    const res = await axiosInstance.delete(`/api/${id}`);
    console.log(res.data, "ini res");
    return res.data;
  } catch (error) {
    console.log(error, "ini error");
  }
};

// Example Delete Data 

// const deleteData = async () => {
//     const idToDelete = 123;
//     try {
//       const response = await deleteDataApi(`/api/${idToDelete}`);
//       console.log(response);
//       // Lakukan sesuatu dengan data response
//     } catch (error) {
//       console.log(error);
//       // Tangani error dengan cara yang sesuai
//     }
    
// }

// Finish

export const updateDataApi = async (id, data) => {
  try {
    const res = await axiosInstance.put(`/api/${id}`, data);
    console.log(res.data, "ini res");
    return res.data;
  } catch (error) {
    console.log(error, "ini error");
  }
};

//Example Update Data 

// const updateData = async () => {
//     const idToUpdate = 456;
//     const updatedData = { name: 'Jane Doe', age: 35 };
//     try {
//       const response = await updateDataApi(`/api/${idToUpdate}`, updatedData);
//       console.log(response);
//       // Lakukan sesuatu dengan data response
//     } catch (error) {
//       console.log(error);
//       // Tangani error dengan cara yang sesuai
//     }
    
// }

// Finish

