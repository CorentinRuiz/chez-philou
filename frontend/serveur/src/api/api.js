import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: `http://${process.env.REACT_APP_BACKEND_URL}`,
  });