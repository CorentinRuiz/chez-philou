const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Welcome to route1");
});

module.exports = router;
