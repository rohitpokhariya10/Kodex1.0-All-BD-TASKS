const express = require("express");
const errorMiddleware = require("./middleware/error.middleware");
const authRouter = require("./routes/auth.routes");

const app = express();

app.use(express.json());


app.use("/api/auth" , authRouter);
app.use(errorMiddleware);
module.exports = app;
