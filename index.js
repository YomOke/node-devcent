require("express-async-errors");
const config = require("config");
const dotenv = require("dotenv");
const express = require("express");
const mongodb = require("./startup/db");

const app = express();

dotenv.config();

const routers = require("./startup/routes");
routers(app);

mongodb();

const port = config.get("port") || 3006;
app.listen(port, () => console.log(`Listening on port ${port}...`));
