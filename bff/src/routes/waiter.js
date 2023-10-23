const express = require("express");
const {callWaiter} = require("../socket");
const router = express.Router();
const logger = require("../logger");

router.post("/notify", (req, res) => {
    const tableNumber = req.body.tableNumber;

    logger.info("POST /waiter/notify");
    logger.info(`Table ${tableNumber} is asking for a waiter...`);

    res.sendStatus(200);
    callWaiter(tableNumber);
});

module.exports = router;