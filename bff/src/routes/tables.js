const express = require("express");
const {
    getAllTables,
    getTableInformation,
    updateTable,
} = require("../api/tables");
const {
    TABLE_BLOCKED,
    TABLE_OPEN,
    TABLE_AVAILABLE, ANOTHER_SERVICE_READY, READY_TO_SERVE, PREPARATION_IN_PROGRESS,
} = require("../constants/constants");
const {getTableOrderById} = require("../api/orders");
const {getPreparationStatusFromId} = require("../api/preparations");
const notifyFront = require("../socket");
const router = express.Router();
const logger = require("../logger");

router.get("/", (req, res) => {
    logger.info("GET /tables");
    logger.info("Front-end is asking for all tables...")

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

        const allTables = await Promise.all(tablePromises);

        logger.info("Sending all tables to front-end...");
        res.status(200).send(allTables);
    }).catch((reason) => {
        logger.error("Error while retrieving tables");
        res.status(500).send(reason);
    });
});

router.post("/update-table/:tableId", async (req, res) => {
    logger.info("POST /tables/update-table/:tableId");
    logger.info("Front-end is asking to update table " + req.params.tableId + "...");

    try {
        const result = await updateTable(req.params.tableId, req.body.blocked);

        logger.info("Table " + req.params.tableId + " updated.");
        res.status(200).json(result.data);
        notifyFront();
    } catch (error) {
        logger.error("Error while updating table");
        res.status(500).send("An error occurred while updating table.");
    }
});

router.get("/:tableId/customers-count", async (req, res) => {
    logger.info("GET /tables/:tableId/customers-count");
    logger.info("Front-end is asking for the number of customers for table " + req.params.tableId + "...");

    try {
        const tableId = req.params.tableId;

        // Step 1: Get table information to obtain "tableOrderId"
        const tableInfo = await getTableInformation(tableId);
        const tableOrderId = tableInfo.data.tableOrderId;

        // Step 2: Get the number of customers ("customersCount") using "tableOrderId"
        const tableOrderInfo = await getTableOrderById(tableOrderId);
        const customersCount = tableOrderInfo.data.customersCount;

        // Respond with the number of customers
        logger.info("Sending the number of customers for table " + req.params.tableId + "...");
        res.status(200).json({customersCount});
    } catch (error) {
        logger.error("Error while retrieving customers count");
        res.status(500).send("An error occurred while retrieving customers count.");
    }
});

router.get("/tableInfo/:tableId", async (req, res) => {
    logger.info("GET /tables/tableInfo/:tableId");
    logger.info("Front-end is asking for the table information for table " + req.params.tableId + "...");

    try {
        const tableId = req.params.tableId;
        const tableInfo = await getTableInformation(tableId);

        logger.info("Sending the table information for table " + req.params.tableId + "...");
        res.status(200).json(tableInfo.data);
    } catch (error) {
        logger.error("Error while retrieving customers count");
        res.status(500).send("An error occurred while retrieving customers count.");
    }
});
module.exports = router;

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