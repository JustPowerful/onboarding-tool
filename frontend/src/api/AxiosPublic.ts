import axios from "axios";
const AxiosPublic = axios.create({
  baseURL: "/api",
});

export default AxiosPublic;
