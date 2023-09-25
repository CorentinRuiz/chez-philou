const {axiosInstance} = require("./api");

const API_BASE_ROUTE = "/menu/menus";

const getMenus = async () => {
    return await axiosInstance.get(API_BASE_ROUTE);
};

module.exports = {
    getMenus
}