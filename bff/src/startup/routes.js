const express = require("express");
const cors = require("cors");
const indexRouter = require("../routes/index");
const menuRouter = require("../routes/menus");
const tablesRouter = require("../routes/tables");
const kitchenRouter = require("../routes/kitchen");
const ordersRouter = require("../routes/orders");
const preparationsRouter = require("../routes/preparations");
const waiterRouter = require("../routes/waiter");

module.exports = function (app) {
    app.use(express.json());

    const corsOptions = {
        origin: '*',
        methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'UPDATE'],
        credentials: true
    }
    app.use(cors(corsOptions));

    app.use("/", indexRouter);
    app.use("/menus", menuRouter);
    app.use("/tables", tablesRouter);
    app.use("/kitchen", kitchenRouter);
    app.use("/orders", ordersRouter);
    app.use("/preparations", preparationsRouter);
    app.use('/waiter', waiterRouter)
};
