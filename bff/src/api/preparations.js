const {axiosInstance} = require("./api");

const API_BASE_ROUTE = "/kitchen/preparations";

const getPreparationStatusFromId = async (preparationId) => {
    return await axiosInstance.get(`${API_BASE_ROUTE}/${preparationId}`);
}

module.exports = {
    getPreparationStatusFromId
}
