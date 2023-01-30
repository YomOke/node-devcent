const config = require("config");
const mongoose = require("mongoose");

const conn = mongoose.connection;

module.exports = function () {
  const db = config.get("db");

  mongoose.connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  conn.on("error", (err) =>
    console.log("Could not connect to mongoDB...", err)
  );
  conn.once("open", () => console.log(`Connected to ${db}...`));
};
