const {getAllTables, getTableInformation} = require("../api/tables");
const {
    TABLE_BLOCKED,
    TABLE_OPEN,
    ANOTHER_SERVICE_READY,
    READY_TO_SERVE,
    PREPARATION_IN_PROGRESS,
    TABLE_AVAILABLE
} = require("../constants/constants");
const {getTableOrderById} = require("../api/orders");
const {getPreparationStatusFromId} = require("../api/preparations");

const retrieveAllTables = () => {
    return new Promise((resolve, reject) => {
        getAllTables().then(async (response) => {
            const tables = response.data;
            const tablePromises = tables.map(async (table) => {
                const {state, tableOrderInfos} = await getTableState(table);
                return {
                    id: table._id,
                    number: table.number,
                    tableOrderId: table.tableOrderId,
                    state,
                    tableOrderInfos
                };
            });

            resolve(await Promise.all(tablePromises));
        }).catch((reason) => {
            reject(reason);
        })
    })
}

const getTableStateByTableNumber = async (tableNumber) => {
    return await getTableState((await getTableInformation(tableNumber)).data);
}

const getTableState = async (table) => {
    if (table.blocked) return {state: TABLE_BLOCKED, tableOrderInfos: null};
    else if (table.taken && table.tableOrderId !== null) {
        const tableOrders = (await getTableOrderById(table.tableOrderId)).data;

        // Ajout des infos sur la préparation
        const preparationPromises = tableOrders.preparations.map(async (preparation) => {
            return (await getPreparationStatusFromId(preparation._id)).data;
        });

        tableOrders.preparations = await Promise.all(preparationPromises);

        // Il n'y a aucune préparation
        if (tableOrders.preparations.length === 0) return {state: TABLE_OPEN, tableOrderInfos: tableOrders}
        // Il y a déjà des préparations, mais toutes ont été délivrées
        else if (getPreparationNotTakenForService(tableOrders.preparations).length === 0) return {
            state: ANOTHER_SERVICE_READY,
            tableOrderInfos: tableOrders
        }
        // Il y a des préparations en cours prêtes et non livrées
        else if (getPreparationNotTakenForService(tableOrders.preparations)[0].completedAt !== null) return {
            state: READY_TO_SERVE,
            tableOrderInfos: tableOrders
        };
        // Il y a des préparations en cours non prêtes et non livrées
        else return {state: PREPARATION_IN_PROGRESS, tableOrderInfos: tableOrders};
    } else return {state: TABLE_AVAILABLE, tableOrderInfos: null};
}

const getPreparationNotTakenForService = (tablePreparations) => {
    return tablePreparations.filter(preparation => preparation.takenForServiceAt == null);
}

module.exports = {
    retrieveAllTables,
    getTableState,
    getTableStateByTableNumber
};