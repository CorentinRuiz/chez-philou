const express = require("express");
const {postOpenTable, getAllOrders, postOrderItem, postSendPrepareOrder, postBill} = require("../api/orders");
const {handleError} = require("./utils");
const {getMenus} = require("../api/menus");
const {MAIN_COLOR, STARTER_COLOR, BEVERAGE_COLOR, DESSERT_COLOR} = require("../constants/constants");
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

        const result = await postSendPrepareOrder(req.params.tableOrderId);
        const menu = await getMenus();
        const toSend = [];

        for (const preparation of result.data) {

            let totalPrice = 0;
            let preparedItems = [];
            for (const item of preparation.preparedItems) {
                // On cheche si un orderedItem existe déjà pour ce menuItemId
                const preparedItem = preparedItems.find((orderedItem) => {
                    return orderedItem.shortName === item.shortName;
                });

                // Si aucun orderedItem n'existe, on le crée
                if (!preparedItem) {
                    const priceAndColor = getOrderItemPriceAndColor(menu.data, item);

                    preparedItems.push({
                        shortName: item.shortName,
                        howMany: 1,
                        comment: item.comment,
                        price: priceAndColor.price,
                        color: priceAndColor.color
                    });
                    totalPrice += priceAndColor.price;
                } else {
                    // Sinon on incrémente la quantité et le prix
                    const unitPrice = preparedItem.price / preparedItem.howMany;
                    preparedItem.price += unitPrice;
                    preparedItem.howMany++;
                    totalPrice += unitPrice;
                }
            }

            toSend.push({
                _id: preparation._id,
                preparedItems: preparedItems,
                price: totalPrice,
                color: getMajorityColor(preparedItems)
            });
        }

        res.status(200).send(toSend);

    } catch (error) {
        handleError(error, res);
    }
});

function getOrderItemPriceAndColor(menu, item) {
    const menuItem = menu.find((menuItem) => {
        return menuItem.shortName === item.shortName;
    });

    const result = {
        price: menuItem.price,
        color: MAIN_COLOR
    }

    switch (menuItem.category) {
        case 'BEVERAGE':
            result.color = BEVERAGE_COLOR;
            return result;
        case 'STARTER':
            result.color = STARTER_COLOR;
            return result;
        case 'DESSERT':
            result.color = DESSERT_COLOR;
            return result;
        default:
            return result;
    }
}

function getMajorityColor(items) {
    let starterNb = 0;
    let dessertNb = 0;

    for (const item of items) {

        switch (item.color) {
            case BEVERAGE_COLOR:
                return BEVERAGE_COLOR;
            case MAIN_COLOR:
                return MAIN_COLOR;
            case STARTER_COLOR:
                starterNb += item.howMany;
                break;
            case DESSERT_COLOR:
                dessertNb += item.howMany;
                break;
        }
    }

    if (starterNb > dessertNb) {
        return STARTER_COLOR;
    } else {
        return DESSERT_COLOR;
    }
}

router.post("/bill/:tableOrderId", async (req, res) => {
    try {
        const result = await postBill(req.params.tableOrderId);
        res.status(200).json(result.data);
    } catch (error) {
        handleError(error, res);
    }
});

module.exports = router;
