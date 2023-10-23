const express = require("express");
const {
    postOpenTable,
    getAllOrders,
    postOrderItem,
    postSendPrepareOrder,
    postBill,
    getTableOrderById
} = require("../api/orders");
const {handleError} = require("./utils");
const {getMenus} = require("../api/menus");
const {MAIN_COLOR, STARTER_COLOR, BEVERAGE_COLOR, DESSERT_COLOR} = require("../constants/constants");
const {getPreparationStatusFromId} = require("../api/preparations");
const router = express.Router();
const logger = require("../logger");
const {notifyFrontOnTablesUpdate, notifyTableInfos} = require("../socket");
const {notifyOrderReadyToDeliver} = require("../socket");

router.get("/", async (req, res) => {
    logger.info("GET /orders");
    logger.info("Front-end is asking for all orders...");

    try {
        const result = await getAllOrders();

        logger.info("Sending all orders to front-end...");
        res.status(200).send(result.data);
    } catch (error) {
        handleError(error, res);
    }
});

router.post('/ready-to-deliver/', async (req, res) => {
    const tableNumber = req.body.tableNumber;
    res.sendStatus(200);
    notifyOrderReadyToDeliver(tableNumber);

})

router.get("/preparations-status/:tableOrderId", async (req, res) => {
    logger.info("GET /orders/preparations-status/:tableOrderId");
    logger.info("Front-end is asking for the status of the preparations for table order " + req.params.tableOrderId + "...");

    const tableOrder = (await getTableOrderById(req.params.tableOrderId)).data;

    const preparationPromises = tableOrder.preparations.map(async (preparation) => {
        return (await getPreparationStatusFromId(preparation._id)).data;
    });

    const preparations = await Promise.all(preparationPromises);

    const preparation = getPreparationNotTakenForService(preparations)[0];
    const preparationCompleted = isPreparationCompleted(preparation);
    const preparationTimeToDisplay = preparationCompleted ?
        getOnlyTimeFromDate(new Date(preparation.completedAt)) : `~ ${getOnlyTimeFromDate(new Date(preparation.shouldBeReadyAt))}`
    res.status(200).send({
        preparationCompleted: preparationCompleted,
        preparationTime: preparationTimeToDisplay
    });
});

const getPreparationNotTakenForService = (tablePreparations) => {
    return tablePreparations.filter(preparation => preparation.takenForServiceAt == null);
}

const isPreparationCompleted = (preparation) => {
    const completedAt = preparation.completedAt;
    return completedAt !== null;
}

const getOnlyTimeFromDate = (date) => {
    return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'});
}

router.get("/:id", async (req, res) => {
    logger.info("GET /orders/:id");
    logger.info("Front-end is asking for order " + req.params.id + "...");

    try {
        const result = await getTableOrderById(req.params.id);

        logger.info("Sending order " + req.params.id + " to front-end...");
        res.status(200).send(result.data);
    } catch (error) {
        handleError(error, res);
    }
});

router.post("/open-table", async (req, res) => {
    logger.info("POST /orders/open-table");
    logger.info("Front-end is asking to open a table...");

    if (!req.body.tableNumber || !req.body.customersCount) {
        logger.error("Wrong format of request!");
        res.status(400).send("Wrong format of request!");
        return;
    }
    try {
        const result = await postOpenTable(
            req.body.tableNumber,
            req.body.customersCount
        );

        logger.info("Table opened.");
        res.status(200).json(result.data);
        notifyFrontOnTablesUpdate();
        notifyTableInfos(req.body.tableNumber)
    } catch (error) {
        handleError(error, res);
    }
});

router.post("/send-command/:tableOrderId", async (req, res) => {
    const tableOrderId = req.params.tableOrderId;
    logger.info("POST /orders/send-command/:tableOrderId");
    logger.info("Front-end is asking to send a command to table order " + tableOrderId + "...");

    const tableNumber = (await getTableOrderById(req.params.tableOrderId)).data.tableNumber;

    // If no items have been sent of
    if (!req.body.items || req.body.items.length === 0) {
        logger.error("Wrong format of request!");
        res.status(400).send("Wrong format of request!", req.body.items);
        return;
    }
    try {
        for (const item of req.body.items) {
            await postOrderItem(tableOrderId, {
                menuItemId: item._id,
                menuItemShortName: item.shortName,
                howMany: item.quantity,
                comment: item.comment,
            });
        }

        const result = await postSendPrepareOrder(tableOrderId);

        logger.info("Command sent.");
        res.status(200).send(result.data);
        notifyFrontOnTablesUpdate();
        notifyTableInfos(tableNumber);
    } catch (error) {
        handleError(error, res);
    }
});

router.get("/getPastOrders/:tableOrderId", async (req, res) => {
    logger.info("GET /orders/getPastOrders/:tableOrderId");
    logger.info("Front-end is asking for the past orders of table order " + req.params.tableOrderId + "...");

    const menus = await getMenus();

    const tableOrder = await getTableOrderById(req.params.tableOrderId);

    const prepareItems = [];

    for (const preparation of tableOrder.data.preparations) {
        if (preparation) {
            let preparedItems = [];
            for (const item of preparation.preparedItems) {
                const preparedItem = preparedItems.find((orderedItem) => {
                    return orderedItem.shortName === item.shortName;
                });

                if (!preparedItem) {
                    const {price, color} = getOrderItemPriceAndColor(item, menus);
                    preparedItems.push({
                        _id: item._id,
                        shortName: item.shortName,
                        quantity: 1,
                        comment: item.comment,
                        color: color,
                        price: price,
                    });
                } else {
                    preparedItem.quantity++;
                }
            }

            const {color, name} = getMajorityColorAndName(preparedItems);

            prepareItems.push({
                _id: preparation._id,
                preparedItems: preparedItems,
                color: color,
                name: name,
            });
        }
    }

    logger.info("Sending past orders of table order " + req.params.tableOrderId + " to front-end...");
    res.status(200).send(prepareItems);
});

router.post("/bill/:tableOrderId", async (req, res) => {
    logger.info("POST /orders/bill/:tableOrderId");
    logger.info("Front-end is asking for the bill of table order " + req.params.tableOrderId + "...");

    try {
        const result = await postBill(req.params.tableOrderId);

        logger.info("Bill sent.");
        res.status(200).json(result.data);
        notifyFrontOnTablesUpdate();
    } catch (error) {
        handleError(error, res);
    }
});

module.exports = router;

function getOrderItemPriceAndColor(item, menus) {
    const menuItem = menus.data.find((menuItem) => {
        return menuItem.shortName === item.shortName;
    });

    const result = {
        price: menuItem.price,
        color: MAIN_COLOR,
    };

    switch (menuItem.category) {
        case "BEVERAGE":
            result.color = BEVERAGE_COLOR;
            return result;
        case "STARTER":
            result.color = STARTER_COLOR;
            return result;
        case "DESSERT":
            result.color = DESSERT_COLOR;
            return result;
        default:
            return result;
    }
}

function getMajorityColorAndName(items) {
    if (items.some((item) => item.catégorie === "MAIN")) {
        return { color: "#DDD6FC", name: "Main" };
      }
    for (const item of items) {
        switch (item.color) {
            case BEVERAGE_COLOR:
                return {color: BEVERAGE_COLOR, name: "Beverage"};
            case MAIN_COLOR:
                return {color: MAIN_COLOR, name: "Main"};
            case STARTER_COLOR:
                return {color: STARTER_COLOR, name: "Starter"};
            case DESSERT_COLOR:
                return {color: DESSERT_COLOR, name: "Dessert"};
        }
    }
}
