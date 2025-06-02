const Enrollment = require("../models/Enrollment");
const User = require("../models/User");
const CustomError = require("../utils/CustomError");
const { asyncErrorHandler } = require("./errorMiddleware");


const addUserToReqBody = (req, res, next) => {
    req.body.user = req.user.id;
    next();
}

const deleteEnrollmentMiddleware = asyncErrorHandler(async function (req, res, next) {
    let enrollment = await Enrollment.findById(req.params.id);
    let user = await User.findById(req.user.id);

    if (!enrollment)
        throw new CustomError("No enrollment found", 404);

    if (user.role === "user") {
        if (user.id !== enrollment.user.id)
            throw new CustomError("you can not delete this enrollment", 403);
    }
    if (user.role === "teacher") {
        if (user.id !== enrollment.course.teacher.id)
            throw new CustomError("you can not delete this enrollment.", 403);
    }
    next();
});

module.exports = {
    addUserToReqBody,
    deleteEnrollmentMiddleware
}