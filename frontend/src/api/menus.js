import { axiosInstance } from "./api";

const API_BASE_ROUTE = "/menu/menus";

export const getMenus = async () => {
    return await axiosInstance.get(API_BASE_ROUTE);
};

export const addMenuItem = async (fullName, shortName, price, category, image) => {
    const body = {
        fullName: fullName,
        shortName: shortName,
        price: price,
        category: category,
        image: image
    };

    return await axiosInstance.post(API_BASE_ROUTE, body);
};

export const getTableInformation = async (menuItemId) => {
    return await axiosInstance.get(`${API_BASE_ROUTE}/${menuItemId}`);
}