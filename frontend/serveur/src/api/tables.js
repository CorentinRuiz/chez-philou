import { axiosInstance } from "./api";
import {addLinkedTableToStartedOrder} from "./tablesOrders";

const API_BASE_ROUTE = "/tables";

export const getAllTables = async () => {
    return await axiosInstance.get(API_BASE_ROUTE);
};

export const addLinkedTableToOpenTable = async (tableNumberToLink, tableNumberAlreadyStarted, numberOfPeople) => {
    return new Promise(async (resolve) => {
        const tableOrderIdAlreadyStart = (await getTableInformation(tableNumberAlreadyStarted)).data.tableOrderId;
        await updateTable(tableNumberToLink, { linkedTable: tableNumberAlreadyStarted, taken: true });
        await addLinkedTableToStartedOrder(tableNumberToLink, tableOrderIdAlreadyStart, numberOfPeople, tableNumberAlreadyStarted);
        resolve();
    })
}

export const updateTable = async (tableNumber, update) => {
    return await axiosInstance.post(`${API_BASE_ROUTE}/update-table/${tableNumber}`, update);
};

export const addTable = async (tableNumber) => {
    const body = { number: tableNumber };
    return await axiosInstance.post(API_BASE_ROUTE, body);
};

export const getTableInformation = async (tableNumber) =>{
    return await axiosInstance.get(`${API_BASE_ROUTE}/tableInfo/${tableNumber}`);
}