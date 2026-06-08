const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());

app.use(cors({
  origin:"http://localhost:5173",
}))

app.get("/", (req, res) => {
  res.send("BattleBar backend is running");
});

module.exports = app;
