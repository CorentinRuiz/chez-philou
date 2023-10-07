const express = require("express");
const {preparationTakenToTable} = require("../api/preparations");
const router = express.Router();

router.post("/:preparationId/taken-to-table", async (req, res) => {
    try {
        const result = await preparationTakenToTable(req.params.preparationId);

        res.status(200).json(result.data);
    } catch (error) {
        console.error("Error :" + error);
        res.status(500).send("An error occurred.");
    }
});

module.exports = router;
