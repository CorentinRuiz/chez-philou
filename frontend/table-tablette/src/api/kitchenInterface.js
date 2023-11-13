import { axiosInstance } from "./api";

const API_BASE_ROUTE = "/kitchen";
export const getMeanCookingTimeOfSeveralItems = async (items) => {
    return await axiosInstance.post(API_BASE_ROUTE + `/mean-cooking-time`, items);
};