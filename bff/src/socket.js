const http = require("http");
const { Server } = require("socket.io");
const {retrieveAllTables} = require("./functions/tables");
const httpServer = http.createServer();

const PORT = 8080, HOST = "192.168.1.12";

const io = new Server(httpServer, {
    cors: {
        origin: "*", // or a list of origins you want to allow, e.g. ["http://localhost:3000"]
        credentials: true,
    },
});

async function notifyFrontOnTablesUpdate() {
    const allTables = await retrieveAllTables();
    io.emit("TableUpdate", allTables);
}

async function notifyOrderReadyToDeliver(tableNumber) {
    const allTables = await retrieveAllTables();
    io.emit("OrderReady", {allTables, tableNumber});
}

httpServer.listen(PORT, HOST, () => {
    console.log("WebSocket running on port:", PORT);
});

module.exports = {
    notifyFrontOnTablesUpdate,
    notifyOrderReadyToDeliver
};