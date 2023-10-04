const {axiosInstance} = require("./api");

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
    console.log("Fetching menus from API");
    cacheMenu = axiosInstance.get(API_BASE_ROUTE);

    if (timeoutId) {
        clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
        cacheMenu = null;
        console.log('Menu réinitialisé après 30 secondes.');
    }, 30000); // 30 000 millisecondes (30 secondes)

    return await cacheMenu;
}

module.exports = {
    getMenus,
    forceUpdateOfMenu
}