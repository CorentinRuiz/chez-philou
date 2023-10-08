const {axiosInstance} = require("./api");
const logger = require("../logger");

const API_BASE_ROUTE = "/menu/menus";

let cacheMenu = null;
let timeoutId = null;

const getMenus = async () => {
    if (cacheMenu) {
        return cacheMenu;
    }
    return await forceUpdateOfMenu();
};

const forceUpdateOfMenu = async () => {
    logger.info("Fetching menus from API");
    cacheMenu = axiosInstance.get(API_BASE_ROUTE);

    if (timeoutId) {
        clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
        cacheMenu = null;
        logger.info('Menu reset after 30 seconds');
    }, 30000); // 30 000 millisecondes (30 secondes)

    return await cacheMenu;
}

module.exports = {
    getMenus,
    forceUpdateOfMenu
}
