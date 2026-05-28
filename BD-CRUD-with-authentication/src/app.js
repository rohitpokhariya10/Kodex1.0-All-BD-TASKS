const express = require("express");
const errorMiddleware = require("./middleware/error.middleware");
const authRouter = require("./routes/auth.routes");
const noteRouter = require("./routes/note.routes");
const cookieParser = require("cookie-parser");

// Create the main Express app instance.
const app = express();

// Parse incoming JSON request bodies.
app.use(express.json());

// Parse cookies so auth middleware can read JWT_TOKEN.
app.use(cookieParser());

// Register API route handlers.
app.use("/api/auth", authRouter);
app.use("/api", noteRouter);

// Handle errors from routes and middleware.
app.use(errorMiddleware);

module.exports = app;
