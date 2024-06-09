import axios from "axios";
const AxiosPrivate = axios.create({
  baseURL: "/api",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export default AxiosPrivate;
