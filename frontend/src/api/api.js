import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: process.env.BASE_API_URL
  });