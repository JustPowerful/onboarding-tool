import axios from "axios";
const AxiosPrivate = axios.create({
  baseURL: import.meta.env.PROD ? import.meta.env.VITE_API_ENDPOINT : "/api",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export default AxiosPrivate;
