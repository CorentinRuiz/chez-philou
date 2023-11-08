import { axiosInstance } from "./api";

const API_BASE_ROUTE = "/orders";

export const getAllOrders = async () => {
  return await axiosInstance.get(API_BASE_ROUTE);
};

export const addOrdersInBasket = async (baskets, tableNumber) => {
  return await axiosInstance.post(`${API_BASE_ROUTE}/baskets`, {
    tableNumber: tableNumber,
    baskets: baskets,
  });
};

export const openRecapBasket = async (tableNumber, basket) => {
  return await axiosInstance.post(`${API_BASE_ROUTE}/open-recap-basket`, {
    tableNumber: tableNumber,
    basket: basket
  });
}

export const preparationStatus = async (tableOrderId) => {
  return await axiosInstance.get(
    `${API_BASE_ROUTE}/preparations-status/${tableOrderId}`
  );
};

export const createNewOrder = async (tableNumber, customersCount) => {
  const body = { tableNumber: tableNumber, customersCount: customersCount, linkedTables: 1 };
  return await axiosInstance.post(`${API_BASE_ROUTE}/open-table`, body);
};

export const getAllOrdersByTableOrderId = async (tableOrderId) => {
  return await axiosInstance.get(`${API_BASE_ROUTE}/${tableOrderId}`);
};

export const addItemToTableOrder = async (
  tableOrderId,
  menuItemId,
  menuItemShortName,
  howMany,
  comment = null
) => {
  const body = {
    menuItemId: menuItemId,
    menuItemShortName: menuItemShortName,
    howMany: howMany,
    comment: comment,
  };

  return await axiosInstance.post(`${API_BASE_ROUTE}/${tableOrderId}`, body);
};

export const sendOrderToKitchen = async (tableOrder, tableOrderId) => {
  return await axiosInstance.post(
    `${API_BASE_ROUTE}/send-command/${tableOrderId}`,
    { items: tableOrder }
  );
};

export const startTableOrderPreparation = async (tableOrderId) => {
  return await axiosInstance.post(`${API_BASE_ROUTE}/${tableOrderId}/prepare`);
};

export const createBillForTheTable = async (tableOrderId) => {
  return await axiosInstance.post(`${API_BASE_ROUTE}/bill/${tableOrderId}`);
};

export const getCustomersCountOnTableOrder = async (tableOrderId) => {
  return (await axiosInstance.get(`${API_BASE_ROUTE}/${tableOrderId}`)).data
    .customersCount;
};

export const getPastOrders = async (tableOrderId) => {
  return await axiosInstance.get(
    `${API_BASE_ROUTE}/getPastOrders/${tableOrderId}`
  );
};
