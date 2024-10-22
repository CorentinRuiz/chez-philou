const {axiosInstance} = require("./api");

const API_BASE_ROUTE = "/kitchen";

const getMeanCookingTime = async (shortName) => {
    return await axiosInstance.post(`${API_BASE_ROUTE}/kitchen-facade/meanCookingTime`, {shortName});
}

module.exports = {
    getMeanCookingTime
}
