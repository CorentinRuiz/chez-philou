import { axiosInstance } from "./api";

const API_BASE_ROUTE = "/kitchen/preparedItems";

export const getPreparedItemsInfoFromId = async (preparedItemsId) => {
    return await axiosInstance.get(`${API_BASE_ROUTE}/${preparedItemsId}`);
}