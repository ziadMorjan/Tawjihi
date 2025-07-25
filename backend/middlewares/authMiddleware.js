import User from "../models/User.js";
import CustomError from "../utils/CustomError.js";
import { verifyToken } from "../utils/JWTs.js";
import { asyncErrorHandler } from "./errorMiddleware.js";

export const protect = asyncErrorHandler(async function (req, res, next) {
    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader)
        token = authHeader.split(" ")[1];

    if (req.cookies.token)
        ({ token } = req.cookies);

    if (!token)
        throw new CustomError("You are not logged in", 401);

    let decoded = await verifyToken(token);

    if (!decoded)
        throw new CustomError("Invalid token", 401);

    let user = await User.findById(decoded.id);

    if (!user || !user.isActive)
        throw new CustomError("The user provided in the token not found", 401);

    if (user.PasswordChangedAt) {
        if (user.PasswordChangedAt.getTime() > decoded.iat * 1000)
            throw new CustomError("User recently changed password, please login again", 401);
    }

    req.user = user;
    next();
});

export const allowedTo = (...roles) => asyncErrorHandler(async function (req, res, next) {
    if (!roles.includes(req.user.role))
        throw new CustomError("You are not allowed to perform this action", 403);

    next();
});
