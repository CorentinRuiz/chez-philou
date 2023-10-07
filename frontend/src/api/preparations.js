import { axiosInstance } from "./api";

const API_BASE_ROUTE = "/kitchen/preparations";

export const getPreparationStatusFromId = async (preparationId) => {
    return await axiosInstance.get(`${API_BASE_ROUTE}/${preparationId}`);
}

export const preparationTakenToTable = async (preparationId) => {
    return await axiosInstance.post(`${API_BASE_ROUTE}/${preparationId}/takenToTable`);
}