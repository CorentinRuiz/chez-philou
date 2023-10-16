const express = require("express");
const app = express();

require("./startup/routes")(app);

const port = process.env.BFF_SERVER_PORT;

app.listen(port, () => console.log(`Listening on port ${port}...`));
