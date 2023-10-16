import { axiosInstance } from "./api";

const API_BASE_ROUTE = "/preparations";

export const preparationTakenToTable = async (preparationId) => {
    return await axiosInstance.post(`${API_BASE_ROUTE}/${preparationId}/taken-to-table`);
}