const http = require("http");
const { Server } = require("socket.io");
const {retrieveAllTables, getTableStateByTableNumber} = require("./functions/tables");
const httpServer = http.createServer();

const PORT = process.env.BFF_WEBSOCKET_PORT, HOST = process.env.BFF_WEBSOCKET_HOST;

const io = new Server(httpServer, {
    cors: {
        origin: "*", // or a list of origins you want to allow, e.g. ["http://localhost:3000"]
        credentials: true,
    },
});

async function notifyFrontOnTablesUpdate(tableNumber) {
    const allTables = await retrieveAllTables();
    io.emit("TableUpdate", allTables);

    if(tableNumber) notifyTableInfos(tableNumber);
}

async function notifyOrderReadyToDeliver(tableNumber) {
    const allTables = await retrieveAllTables();
    io.emit("OrderReady", {allTables, tableNumber});
    notifyTableInfos(tableNumber);
}

async function notifyTableInfos(tableNumber) {
    const tableState = await getTableStateByTableNumber(tableNumber);
    io.emit("TableInfos", {...tableState, tableNumber});
}

async function notifyLinkTable(tableSource, allLinkedTable) {
    io.emit('LinkTable', {tableSource, allLinkedTable});
}

async function notifyUnlinkTable(tableSourceToUnlink) {
    io.emit('UnlinkTable', {tableSourceToUnlink})
}

async function callWaiter(tableNumber) {
    io.emit("CallWaiter", tableNumber);
}

async function notifyBasketsChange(tableNumber,baskets) {
    io.emit("BasketChange", {tableNumber,baskets});
}

async function openRecapBasketOnTablette(tableNumber, basket) {
    io.emit("OpenRecapBasket", {tableNumber: tableNumber, basket: basket})
}

async function openBillOnTablette(tableNumber) {
    io.emit("OpenBill", {tableNumber});
}

io.on('connection', async (socket) => {
    const tableNumberConnected = socket.handshake.query.tableNumber;
   if(tableNumberConnected) await notifyTableInfos(parseInt(tableNumberConnected));
});

httpServer.listen(PORT, HOST, () => {
    console.log("WebSocket running on port:", PORT);
});

module.exports = {
    notifyFrontOnTablesUpdate,
    notifyOrderReadyToDeliver,
    callWaiter,
    notifyBasketsChange,
    openRecapBasketOnTablette,
    openBillOnTablette,
    notifyLinkTable,
    notifyUnlinkTable
};