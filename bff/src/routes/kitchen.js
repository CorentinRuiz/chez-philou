const express = require("express");
const {getMeanCookingTime} = require("../api/kitchen");
const router = express.Router();
const logger = require("../logger");

router.post("/mean-cooking-time", async (req, res) => {
    logger.info("POST /kitchen/mean-cooking-time");
    logger.info("Front-end is asking for the mean cooking time of the items...");

    const items = req.body;

    if (!Array.isArray(items)) {
        logger.error("Wrong format of request!");
        return res.status(400).json({error: "The request body must be a JSON array"});
    }

    let totalCookingTime = 0;

    for (const item of items) {
        if (item.shortName && item.quantity) {
            logger.info("Fetching mean cooking time for item " + item.shortName + "...");

            try {
                const meanCookingTime = await getMeanCookingTime(item.shortName);
                const cookingTime = meanCookingTime.data.meanCookingTimeInSec * item.quantity;
                totalCookingTime += cookingTime;
            } catch (error) {
                console.error("Error fetching mean cooking time:", error);
            }
        }
    }

    logger.info("Total cooking time: " + totalCookingTime + " seconds")
    res.status(200).json({cookingTime: totalCookingTime});
});

module.exports = router;
