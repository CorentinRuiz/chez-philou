const express = require("express");
const router = express.Router();
const { getMenus } = require("../api/menus");
const {
  STARTER_COLOR,
  MAIN_COLOR,
  DESSERT_COLOR,
  BEVERAGE_COLOR,
} = require("../constants/constants");
const logger = require("../logger");

router.get("/:type", async (req, res) => {
  logger.info("GET /menus/" + req.params.type);
  logger.info("Front-end is asking for all " + req.params.type + "...");

  getMenus()
    .then((response) => {
      if (Array.isArray(response.data)) {
        const transformedData = transformAndFilterData(
          response.data,
          req.params.type.toUpperCase()
        );
        logger.info("Sending all " + req.params.type + " to front-end...");
        res.status(200).json(transformedData);
      } else {
        res
          .status(500)
          .json({
            error:
              "The response from the backend is not in the expected format.",
          });
      }
    })
    .catch((reason) => {
      logger.error("Error while sending a request to backend");
      res
        .status(502)
        .json({ error: "Error while sending a request to backend." });
    });
});

router.get("/", async (req, res) => {
  logger.info("GET /menus");
  logger.info("Front-end is asking for all menus...");

  getMenus()
    .then((response) => {
      const menuItems = response.data.map((item) => ({
        ...item,
        quantity: 0,
        color: getColorForCategory(item.category),
      }));
      logger.info("Sending all menus to front-end...");
      res.send(menuItems);
    })
    .catch((reason) => {
      logger.error("Error while sending a request to backend");
      res
        .status(502)
        .json({ error: "Error while sending a request to backend." });
    });
});

module.exports = router;

function transformAndFilterData(data, category) {
  return data
    .filter((item) => item.category === category)
    .map((item) => ({
      _id: item._id,
      shortName: item.shortName,
      quantity: 0,
      price: item.price,
      color: getColorForCategory(item.category),
    }));
}

function getColorForCategory(category) {
  switch (category) {
    case "STARTER":
      return STARTER_COLOR;
    case "MAIN":
      return MAIN_COLOR;
    case "DESSERT":
      return DESSERT_COLOR;
    case "BEVERAGE":
      return BEVERAGE_COLOR;
    default:
      return MAIN_COLOR;
  }
}
