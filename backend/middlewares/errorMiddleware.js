import CustomError from '../utils/CustomError.js';

const devError = function (err, res) {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err
    });
}

const prodError = function (err, res) {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!',
        });
    }
}

const castError = (err) => new CustomError(`Invalid ${err.path}: ${err.value}`, 400);

const validationError = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new CustomError(message, 400);
}

const duplicateError = (err) => {
    const value = err.keyValue.name;
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new CustomError(message, 400);
}

const JsonWebTokenError = () => new CustomError(`Invalid token. Please log in again!`, 401);

const tokenExpiredError = () => new CustomError(`Your token has expired! Please log in again.`, 401);

export const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    err.message = err.message || 'Something went wrong';

    if (process.env.NODE_ENV === 'development') {
        devError(err, res);
    }
    if (process.env.NODE_ENV === 'production') {
        if (err.name === 'CastError') err = castError(err);
        if (err.name === 'ValidationError') err = validationError(err);
        if (err.code === 11000) err = duplicateError(err);
        if (err.name === 'JsonWebTokenError') err = JsonWebTokenError();
        if (err.name === 'TokenExpiredError') err = tokenExpiredError();

        prodError(err, res);
    }
}

export const asyncErrorHandler = function (fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(err => next(err));
    }
}
