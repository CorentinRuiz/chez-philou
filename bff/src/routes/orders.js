const express = require("express");
const {postOpenTable, getAllOrders, postOrderItem, postSendPrepareOrder, postBill} = require("../api/orders");
const {handleError} = require("./utils");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const result = await getAllOrders();
        res.status(200).send(result.data);
    } catch (error) {
        handleError(error, res);
    }
});

router.post("/open-table", async (req, res) => {

    if (!req.body.tableNumber || !req.body.customersCount) {
        res.status(400).send("Wrong format of request!");
        return;
    }
    try {
        const result = await postOpenTable(req.body.tableNumber, req.body.customersCount);

        res.status(200).json(result.data);
    } catch (error) {
        handleError(error, res);
    }
});

router.post("/send-command/:tableOrderId", async (req, res) => {
    // If no items have been sent of
    if (!req.body.items || req.body.items.length === 0) {
        res.status(400).send("Wrong format of request!");
        return;
    }
    try {
        for (const item of req.body.items) {
            await postOrderItem(req.params.tableOrderId, {
                "menuItemId": item._id,
                "menuItemShortName": item.shortName,
                "howMany": item.howMany,
                "comment": item.comment
            });
        }

        await postSendPrepareOrder(req.params.tableOrderId);

        res.status(200).send('done');

    } catch (error) {
        handleError(error, res);
    }
});

router.post("/bill/:tableOrderId", async (req, res) => {
    try {
        const result = await postBill(req.params.tableOrderId);
        res.status(200).json(result.data);
    } catch (error) {
        handleError(error, res);
    }
});

module.exports = router;
