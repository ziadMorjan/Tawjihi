const validator = require('express-validator');
const CustomError = require('../utils/CustomError');

const validationMiddleware = function (req, res, next) {
    let errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
        let message = errors.array().map((el) => el.msg).join('. ');
        return next(new CustomError(message, 400));
    }
    next();
}

module.exports = { validationMiddleware };