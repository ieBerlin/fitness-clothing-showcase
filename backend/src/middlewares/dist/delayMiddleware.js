"use strict";
exports.__esModule = true;
var delayMiddleware = function (req, res, next) {
    var delay = 1700;
    setTimeout(function () {
        next();
    }, delay);
};
exports["default"] = delayMiddleware;
