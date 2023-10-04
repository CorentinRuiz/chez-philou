const {axiosInstance} = require("./api");

const API_BASE_ROUTE = "/dining/tables";

const getAllTables = async () => {
    return await axiosInstance.get(API_BASE_ROUTE);
};

const getTableInformation = async (tableNumber) =>{
    return await axiosInstance.get(`${API_BASE_ROUTE}/${tableNumber}`);
};

const updateTable = async (tableId, blocked) => {
    return await axiosInstance.post(`${API_BASE_ROUTE}/update/${tableId}`, { "blocked": blocked});
}

module.exports = {
    getAllTables,
    getTableInformation,
    updateTable,
}
