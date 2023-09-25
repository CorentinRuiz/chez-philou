const {axiosInstance} = require("./api");

const API_BASE_ROUTE = "/dining/tables";

const getAllTables = async () => {
    return await axiosInstance.get(API_BASE_ROUTE);
};

module.exports = {
    getAllTables
}
