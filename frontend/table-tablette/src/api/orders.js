import { axiosInstance } from "./api";

const API_BASE_ROUTE = "/orders";

export const getPastOrders = async (tableOrderId) => {
    return await axiosInstance.get(`${API_BASE_ROUTE}/getPastOrders/${tableOrderId}`);
};