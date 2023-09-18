const express = require("express");
const indexRouter = require("../routes/index");
const router1Router = require("../routes/route1");

module.exports = function (app) {
    app.use(express.json());

    app.use("/", indexRouter);
    app.use("/route1", router1Router);
};
