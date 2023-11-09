const {axiosInstance} = require("./api");

const API_BASE_ROUTE = "/dining/tableOrders";

const postOpenTable = async (tableId, nbCustomer, linkedTables) => {
    return (await axiosInstance.post(`${API_BASE_ROUTE}/`,
        {
            "tableNumber": tableId,
            "customersCount": nbCustomer,
            "linkedTables": linkedTables
        }));
};

const addLinkedTableToStartedOrder = async (howManyMorePeople, tableNumberToLink, tableOrderId) => {
    return await axiosInstance.post(`${API_BASE_ROUTE}/update`, {
        howManyMorePeople: howManyMorePeople,
        orderId: tableOrderId,
        tableNumberToAdd: tableNumberToLink
    });
}

const getAllOrders = async () => {
    return await axiosInstance.get(API_BASE_ROUTE);
};

const getTableOrderById = async (tableOrderId) => {
    return await axiosInstance.get(`${API_BASE_ROUTE}/${tableOrderId}`);
}

const postOrderItem = async (tableOrderId, orderItem) => {
    return await axiosInstance.post(`${API_BASE_ROUTE}/${tableOrderId}`, orderItem);
}

const postSendPrepareOrder = async (tableOrderId) => {
    return await axiosInstance.post(`${API_BASE_ROUTE}/${tableOrderId}/prepare`);
}

const postBill = async (tableOrderId) => {
    return await axiosInstance.post(`${API_BASE_ROUTE}/${tableOrderId}/bill`);
};

module.exports = {
    postOpenTable,
    getAllOrders,
    getTableOrderById,
    postOrderItem,
    postSendPrepareOrder,
    postBill,
    addLinkedTableToStartedOrder
}
