const express = require("express");
const {getAllTables, getTableInformation, updateTable} = require("../api/tables");
const {TABLE_BLOCKED, TABLE_OPEN, TABLE_AVAILABLE} = require("../constants/constants");
const {getTableOrderById} = require("../api/orders");
const router = express.Router();

router.get("/", (req, res) => {
    getAllTables().then((response) => {
        const editedArray = response.data.map((table) => {
            return {
                id: table._id,
                number: table.number,
                state: table.blocked ? TABLE_BLOCKED : (table.taken ? TABLE_OPEN : TABLE_AVAILABLE)
            };
        });
        res.status(200).send(editedArray);
    }).catch((reason) => {
        res.status(500).send(reason);
    });
});

router.post("/update-table/:tableId", async (req, res) => {
    try {
        const result = await updateTable(req.params.tableId, req.body.blocked);

        res.status(200).json(result.data);
    } catch (error) {
        console.error("Error while updating table:", error);
        res.status(500).send("An error occurred while updating table.");
    }
});

router.get("/:tableId/customers-count", async (req, res) => {
    try {
        const tableId = req.params.tableId;

        // Step 1: Get table information to obtain "tableOrderId"
        const tableInfo = await getTableInformation(tableId);
        const tableOrderId = tableInfo.data.tableOrderId;

        // Step 2: Get the number of customers ("customersCount") using "tableOrderId"
        const tableOrderInfo = await getTableOrderById(tableOrderId);
        const customersCount = tableOrderInfo.data.customersCount;

        // Respond with the number of customers
        res.status(200).json({ customersCount });
    } catch (error) {
        console.error("Error while retrieving customers count:", error);
        res.status(500).send("An error occurred while retrieving customers count.");
    }
});
module.exports = router;
