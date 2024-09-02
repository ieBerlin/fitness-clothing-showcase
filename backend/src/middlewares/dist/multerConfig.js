"use strict";
exports.__esModule = true;
exports.storeImage = void 0;
var multer_1 = require("multer");
var path_1 = require("path");
var ValidationError_1 = require("../utils/ValidationError");
var storage = function (imageFolder) { return multer_1["default"].diskStorage({
    filename: function (_req, file, cb) {
        var uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        var fileExtension = path_1["default"].extname(file.originalname);
        cb(null, "" + uniqueSuffix + fileExtension);
    },
    destination: function (_req, _file, cb) {
        cb(null, "public/uploads/" + imageFolder);
    }
}); };
var upload = function (imageFolder) { return multer_1["default"]({
    storage: storage(imageFolder)
}); };
function storeImage(req, res, next) {
    var urlPath = req.url;
    var regex = /^\/upload\/([^\/]+)/;
    var match = urlPath.match(regex);
    if (!match || !["product", "admin"].includes(match[1])) {
        var errorResponse = {
            success: false,
            errors: [
                {
                    field: "urlPath",
                    message: "Invalid URL path or no matching type found.",
                    code: ValidationError_1.ErrorCode.ValidationError,
                    severity: ValidationError_1.ErrorSeverity.Medium
                },
            ]
        };
        return res.status(400).json(errorResponse);
    }
    var imageFolder = match[1];
    req.imageFolder = imageFolder;
    var uploadMiddleware = upload(imageFolder);
    uploadMiddleware.single("image")(req, res, function (err) {
        if (err instanceof multer_1.MulterError) {
            var errorResponse = {
                success: false,
                errors: [
                    {
                        field: "file",
                        message: "Multer error occurred during file upload.",
                        code: ValidationError_1.ErrorCode.ServerError,
                        severity: ValidationError_1.ErrorSeverity.Medium
                    },
                ]
            };
            return res.status(400).json(errorResponse);
        }
        else if (err) {
            console.error("Upload error:", err);
            var errorResponse = {
                success: false,
                errors: [
                    {
                        field: "file",
                        message: "Unknown error occurred during file upload.",
                        code: ValidationError_1.ErrorCode.ServerError,
                        severity: ValidationError_1.ErrorSeverity.Critical
                    },
                ]
            };
            return res.status(500).json(errorResponse);
        }
        if (!req.file) {
            var errorResponse = {
                success: false,
                errors: [
                    {
                        field: "file",
                        message: "No file uploaded.",
                        code: ValidationError_1.ErrorCode.ValidationError,
                        severity: ValidationError_1.ErrorSeverity.Medium
                    },
                ]
            };
            return res.status(400).json(errorResponse);
        }
        req.imageName = req.file.filename;
        next();
    });
}
exports.storeImage = storeImage;
