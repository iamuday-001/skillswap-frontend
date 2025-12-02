import axios from "axios";

const instance = axios.create({
  baseURL: "https://skillswap-backend-hj73.onrender.com/api",
  withCredentials: true,
});

export default instance;
