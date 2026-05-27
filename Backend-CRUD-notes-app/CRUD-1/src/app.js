const express = require("express");
const app = express();
const noteRouter = require("./routes/notes.routes");
const errorMiddleware = require("./middleware/error.middleware");
app.use(express.json());


app.use("/api", noteRouter);

app.use(errorMiddleware);
module.exports = app;