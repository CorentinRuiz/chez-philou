import { axiosInstance } from "./api";

const API_BASE_ROUTE = "/kitchen/kitchen-facade";

export const getMeanCookingTime = async (shortName) => {
    return await axiosInstance.post(API_BASE_ROUTE + `/meanCookingTime`, {shortName: shortName});
};