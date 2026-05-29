const express = require("express");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./utils/apiError");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use(errorMiddleware);

module.exports = app;