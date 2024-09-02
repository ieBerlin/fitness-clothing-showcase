"use strict";
exports.__esModule = true;
var cors = require("cors");
var corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: "*"
};
exports["default"] = cors(corsOptions);
