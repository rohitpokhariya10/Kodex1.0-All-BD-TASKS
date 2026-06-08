const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
  process.env.RENDER_EXTERNAL_URL,
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
}));

app.get("/health", (req, res) => {
  res.send("BattleBar backend is running");
});

const frontendDistPath = path.join(__dirname, "../public");

app.use(express.static(frontendDistPath));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(frontendDistPath, "index.html"));
});

module.exports = app;
