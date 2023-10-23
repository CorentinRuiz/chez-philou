import { axiosInstance } from "./api";

const API_BASE_ROUTE = "/waiter";

export const callWaiter = async (tableNumber) => {
    return await axiosInstance.post(`${API_BASE_ROUTE}/notify`, {tableNumber});
};