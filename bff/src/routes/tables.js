const express = require("express");
const {getAllTables} = require("../api/tables");
const {TABLE_BLOCKED, TABLE_OPEN, TABLE_AVAILABLE} = require("../constants/constants");
const router = express.Router();

router.get("/", (req, res) => {
    getAllTables().then((response) => {
        const editedArray = response.data.map((table) => {
            return {
                id: table._id,
                number: table.number,
                state: table.blocked ? TABLE_BLOCKED : (table.taken ? TABLE_OPEN : TABLE_AVAILABLE)
            };
        });
        res.status(200).send(editedArray);
    }).catch((reason) => {
        res.status(500).send(reason);
    });
});

module.exports = router;
