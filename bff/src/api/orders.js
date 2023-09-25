const {axiosInstance} = require("./api");

const API_BASE_ROUTE = "/dining/tableOrders";

const getAllOrders = async () => {
    return await axiosInstance.get(API_BASE_ROUTE);
};

const getTableOrderById = async (tableOrderId) => {
    return await axiosInstance.get(`${API_BASE_ROUTE}/${tableOrderId}`);
}

module.exports = {
    getAllOrders,
    getTableOrderById
}
