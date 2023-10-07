import { axiosInstance } from "./api";

const API_BASE_ROUTE = "/menus";


export const getMenus = async () => {
    return await axiosInstance.get(`${API_BASE_ROUTE}`);
};

export const getMenuByType = async (type) => {
    return await axiosInstance.get(`${API_BASE_ROUTE}/${type}`);
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

export const getMenuInformation = async (menuItemId) => {
    return await axiosInstance.get(`${API_BASE_ROUTE}/${menuItemId}`);
}