const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Welcome to root URL of Server");
});

module.exports = router;
