const express = require("express");
const {getMeanCookingTime} = require("../api/kitchen");
const router = express.Router();
router.post("/mean-cooking-time", async (req, res) => {
    const items = req.body;

    if (!Array.isArray(items)) {
        return res.status(400).json({error: "The request body must be a JSON array"});
    }

    let totalCookingTime = 0;

    for (const item of items) {
        if (item.shortName && item.quantity) {
            try {
                const meanCookingTime = await getMeanCookingTime(item.shortName);
                const cookingTime = meanCookingTime.data.meanCookingTimeInSec * item.quantity;
                totalCookingTime += cookingTime;
            } catch (error) {
                console.error("Error fetching mean cooking time:", error);
            }
        }
    }

    res.status(200).json({cookingTime: totalCookingTime});
});

module.exports = router;
