import { axiosInstance } from "./api";

const API_BASE_ROUTE = "/tables";

export const getAllTables = async () => {
    return await axiosInstance.get(API_BASE_ROUTE);
};

export const addTable = async (tableNumber) => {
    const body = { number: tableNumber };
    return await axiosInstance.post(API_BASE_ROUTE, body);
};

export const getTableInformation = async (tableNumber) =>{
    return await axiosInstance.get(`${API_BASE_ROUTE}/${tableNumber}`);
}