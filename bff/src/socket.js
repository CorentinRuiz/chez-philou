const http = require("http");
const { Server } = require("socket.io");
const httpServer = http.createServer();

const PORT = 8080, HOST = "localhost";

const io = new Server(httpServer, {
    cors: {
        origin: "*", // or a list of origins you want to allow, e.g. ["http://localhost:3000"]
        credentials: true,
    },
});

async function notifyFront() {
    io.emit("Update");
}

httpServer.listen(PORT, HOST, () => {
    console.log("WebSocket running on port:", PORT);
});

module.exports = notifyFront;