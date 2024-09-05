import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api.tu-backend.com", // Cambia esto por tu API
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
