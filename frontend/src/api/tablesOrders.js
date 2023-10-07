import { axiosInstance } from "./api";

const API_BASE_ROUTE = "/dining/tableOrders";

export const getAllOrders = async () => {
    return await axiosInstance.get(API_BASE_ROUTE);
};

export const createNewOrder = async (tableNumber, customersCount) => {
    const body = { tableNumber: tableNumber, customersCount: customersCount };
    return await axiosInstance.post(API_BASE_ROUTE, body);
};

export const getAllOrdersByTableOrderId = async (tableOrderId) => {
    return await axiosInstance.get(`${API_BASE_ROUTE}/${tableOrderId}`);
}

export const addItemToTableOrder = async (tableOrderId,menuItemId, menuItemShortName, howMany, comment = null) => {
    const body = {
        menuItemId: menuItemId,
        menuItemShortName: menuItemShortName,
        howMany: howMany,
        comment: comment
    };

    return await axiosInstance.post(`${API_BASE_ROUTE}/${tableOrderId}`, body);
};

export const startTableOrderPreparation = async (tableOrderId) => {
    return await axiosInstance.post(`${API_BASE_ROUTE}/${tableOrderId}/prepare`);
};

export const createBillForTheTable = async (tableOrderId) => {
    return await axiosInstance.post(`${API_BASE_ROUTE}/${tableOrderId}/bill`);
};

export const getCustomersCountOnTableOrder = async (tableOrderId) => {
    return (await axiosInstance.get(`${API_BASE_ROUTE}/${tableOrderId}`)).data.customersCount;
}