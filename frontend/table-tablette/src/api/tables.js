import { axiosInstance } from "./api";

const API_BASE_ROUTE = "/tables";

export const getTablesNumbers = async () => {
    return await axiosInstance.get(`${API_BASE_ROUTE}`);
};