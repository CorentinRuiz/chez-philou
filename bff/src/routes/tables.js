const express = require("express");
const {
    getTableInformation,
    updateTable,
} = require("../api/tables");
const {getTableOrderById} = require("../api/orders");
const {notifyFrontOnTablesUpdate} = require("../socket");
const router = express.Router();
const logger = require("../logger");
const {retrieveAllTables} = require("../functions/tables");

router.get("/", (req, res) => {
    logger.info("GET /tables");
    logger.info("Front-end is asking for all tables...")

    retrieveAllTables().then(async (allTables) => {
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
        notifyFrontOnTablesUpdate();
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