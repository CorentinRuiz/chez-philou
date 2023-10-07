const express = require("express");
const {
  postOpenTable,
  getAllOrders,
  postOrderItem,
  postSendPrepareOrder,
  postBill,
  getTableOrderById,
} = require("../api/orders");
const { handleError } = require("./utils");
const { getMenus } = require("../api/menus");
const {
  MAIN_COLOR,
  STARTER_COLOR,
  BEVERAGE_COLOR,
  DESSERT_COLOR,
} = require("../constants/constants");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await getAllOrders();
    res.status(200).send(result.data);
  } catch (error) {
    handleError(error, res);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await getTableOrderById(req.params.id);
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
    const result = await postOpenTable(
      req.body.tableNumber,
      req.body.customersCount
    );

    res.status(200).json(result.data);
  } catch (error) {
    handleError(error, res);
  }
});

router.post("/send-command/:tableOrderId", async (req, res) => {
  console.log("send-command",req.body);
  console.log("items",req.body.items);
  // If no items have been sent of
  if (!req.body.items || req.body.items.length === 0) {
    res.status(400).send("Wrong format of request!", req.body.items);
    return;
  }
  try {
    for (const item of req.body.items) {
      await postOrderItem(req.params.tableOrderId, {
        menuItemId: item._id,
        menuItemShortName: item.shortName,
        howMany: item.quantity,
        comment: item.comment,
      });
    }

    const result = await postSendPrepareOrder(req.params.tableOrderId);

    res.status(200).send(result.data);
  } catch (error) {
    handleError(error, res);
  }
});

router.get("/getPastOrders/:tableOrderId", async (req, res) => {
  const menus = await getMenus();

  const tableOrder = await getTableOrderById(req.params.tableOrderId);

  const prepareItems = [];

  console.log(tableOrder.data);

  for (const preparation of tableOrder.data.preparations) {
    if (preparation) {
      let preparedItems = [];
      for (const item of preparation.preparedItems) {
        const preparedItem = preparedItems.find((orderedItem) => {
          return orderedItem.shortName === item.shortName;
        });

        if (!preparedItem) {
          const { price, color } = getOrderItemPriceAndColor(item, menus);
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

      const { color, name } = getMajorityColorAndName(preparedItems);

      prepareItems.push({
        _id: preparation._id,
        preparedItems: preparedItems,
        color: color,
        name: name,
      });
    }
  }
  res.status(200).send(prepareItems);
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
  for (const item of items) {
    switch (item.color) {
      case BEVERAGE_COLOR:
        return { color: BEVERAGE_COLOR, name: "Beverage" };
      case MAIN_COLOR:
        return { color: MAIN_COLOR, name: "Main" };
      case STARTER_COLOR:
        return { color: STARTER_COLOR, name: "Starter" };
      case DESSERT_COLOR:
        return { color: DESSERT_COLOR, name: "Dessert" };
    }
  }
}
