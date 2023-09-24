import { axiosInstance } from "./api";
import {tab} from "@testing-library/user-event/dist/tab";

const API_BASE_ROUTE = "/dining/tables";

export const getAllTables = async () => {
    return await axiosInstance.get(API_BASE_ROUTE);
};

export const updateTable = async (tableNumber, update) => {
    const body = { ...update };
    return await axiosInstance.post(`${API_BASE_ROUTE}/update/${tableNumber}`, body);
};

export const addTable = async (tableNumber) => {
    const body = { number: tableNumber };
    return await axiosInstance.post(API_BASE_ROUTE, body);
};

export const getTableInformation = async (tableNumber) =>{
    return await axiosInstance.get(`${API_BASE_ROUTE}/${tableNumber}`);
}