const validator = require('express-validator');
const CustomError = require('../utils/CustomError');
const uploadToCloud = require("../utils/uploadToCloud");
const removeLocalFiles = require("../utils/removeLocalFiles");
const { asyncErrorHandler } = require('./errorMiddleware');

const validationMiddleware = asyncErrorHandler(function (req, res, next) {
    let errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
        removeLocalFiles(req);
        console.log(errors.array());
        let message = errors.array().map((el) => el.msg).join(' | ');
        return next(new CustomError(message, 400));
    }
    uploadToCloud(req);
    next();
});

module.exports = { validationMiddleware };