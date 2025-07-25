import CustomError from '../utils/CustomError.js';
import { asyncErrorHandler } from './errorMiddleware.js';

export const addUserIdToReqParams = function (req, res, next) {
    req.params.id = req.user.id;
    next();
}

export const updateMeMiddleware = asyncErrorHandler(async function (req, res, next) {
    if (req.body.password || req.body.password)
        throw new CustomError("You can not change your password from here!", 403);
    if (req.body.role)
        throw new CustomError("You can not change your role!", 403);
    next();
});

export const activationMiddleware = bool => function (req, res, next) {
    req.body = { isActive: bool };
    next();
}
