const {axiosInstance} = require("./api");

const API_BASE_ROUTE = "/kitchen/preparations";

const getPreparationStatusFromId = async (preparationId) => {
    return await axiosInstance.get(`${API_BASE_ROUTE}/${preparationId}`);
}

const preparationTakenToTable = async (preparationId) => {
    return await axiosInstance.post(`${API_BASE_ROUTE}/${preparationId}/takenToTable`);
}

module.exports = {
    getPreparationStatusFromId,
    preparationTakenToTable
}
