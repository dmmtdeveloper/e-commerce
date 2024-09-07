import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://proyectosocius-hnfjbhheebgefpc7.eastus2-01.azurewebsites.net",
  headers: {
    "Content-Type": "application/json",
  },
});


export default axiosInstance;