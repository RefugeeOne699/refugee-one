import axios from "axios";

import { API_KEY, BASE_URL } from "@/apiConfig";

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "X-RapidAPI-Key": API_KEY,
    "X-RapidAPI-Host": "the-cocktail-db.p.rapidapi.com",
  },
});

// instance.interceptors.response.use(
//   function (response) {
//     return response;
//   },
//   function (error) {
//     if (error.response) {
//       if (error.response.status >= 500 && error.response.status < 600) {
//       }
//       return Promise.reject(error);
//     } else if (error.request) {
//       // The request was made but no response was received
//       // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
//       // http.ClientRequest in node.js
//       // console.log(error.request);
//     } else {
//       // Something happened in setting up the request that triggered an Error
//       // console.log('Error', error.message);
//     }
//     // console.log(error.config);
//   }
// );

export default instance;
