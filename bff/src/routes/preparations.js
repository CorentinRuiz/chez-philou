const express = require("express");
const {preparationTakenToTable} = require("../api/preparations");
const router = express.Router();
const logger = require("../logger");
const {notifyFrontOnTablesUpdate} = require("../socket");

router.post("/:preparationId/taken-to-table", async (req, res) => {
    logger.info("POST /preparations/:preparationId/taken-to-table");
    logger.info("Front-end is asking to update preparation " + req.params.preparationId + "...");

    try {
        const result = await preparationTakenToTable(req.params.preparationId);

        const tableNumber = result.data.tableNumber;

        logger.info("Preparation " + req.params.preparationId + " updated.");
        res.status(200).json(result.data);
        notifyFrontOnTablesUpdate(tableNumber);
    } catch (error) {
        logger.error("Error while updating preparation");
        res.status(500).send("An error occurred.");
    }
});

module.exports = router;
