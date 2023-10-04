const express = require("express");
const indexRouter = require("../routes/index");
const menuRouter = require("../routes/menus");
const tablesRouter = require("../routes/tables");
const kitchenRouter = require("../routes/kitchen");

module.exports = function (app) {
    app.use(express.json());

    app.use("/", indexRouter);
    app.use("/menus", menuRouter);
    app.use("/tables", tablesRouter);
    app.use("/kitchen", kitchenRouter);
};
