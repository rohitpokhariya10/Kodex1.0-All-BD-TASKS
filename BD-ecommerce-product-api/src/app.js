const express = require("express");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("../src/middleware/error.middleware");
const authRouter = require("./routes/auth.routes");
const productRouter = require("./routes/product.routes");
const app = express();

// Parse JSON request bodies for API clients.
app.use(express.json());
// Parse URL-encoded payloads submitted by forms or similar clients.
app.use(express.urlencoded({extended:true}));
// Enable signed-in flows to read and write auth cookies consistently.
app.use(cookieParser());


// Mount all authentication-related endpoints behind a versionable API prefix.
app.use("/api/auth" , authRouter);
// Mount all  Product-related endpoints behind a versionable API prefix.
app.use("/api/product" , productRouter);
// Centralized error handler must be registered after all routes.
app.use(errorMiddleware);

module.exports = app;
