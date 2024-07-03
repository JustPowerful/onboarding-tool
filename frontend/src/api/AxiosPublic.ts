import axios from "axios";
const AxiosPublic = axios.create({
  baseURL: import.meta.env.PROD ? import.meta.env.VITE_API_ENDPOINT : "/api",
});

export default AxiosPublic;
