const express = require("express");

const db = require("./models");

const app = express();
const port = 5000;

db.sequelize
  .sync()
  .then(() => {
    console.log("db connected");
  })
  .catch(console.error);

app.get("/", (req, res) => res.send("Hello World!!"));

app.listen(port, () => console.log("server start"));
