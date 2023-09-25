const express = require("express");
const indexRouter = require("../routes/index");
const menuRouter = require("../routes/menus");
const tablesRouter = require("../routes/tables");

module.exports = function (app) {
    app.use(express.json());

    app.use("/", indexRouter);
    app.use("/menus", menuRouter);
    app.use("/tables", tablesRouter);
};
