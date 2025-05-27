const Course = require("../models/Course");
const CustomError = require("../utils/CustomError");
const { asyncErrorHandler } = require("./errorMiddleware");


const checkCourseBelongToTeacher = asyncErrorHandler(async function (req, res, next) {
    if (req.user.role === "teacher") {
        let course = await Course.findById(req.params.id)
        if (req.user.id !== course.teacher.id)
            throw new CustomError("This course does not belong to you", 403);
    }
    next();
});

module.exports = {
    checkCourseBelongToTeacher
}