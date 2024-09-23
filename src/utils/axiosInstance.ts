import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "https://proyectosocius-hnfjbhheebgefpc7.eastus2-01.azurewebsites.net",
  baseURL: "http://localhost:5239",
  headers: {
    "Content-Type": "application/json",
  },
});


export default axiosInstance;