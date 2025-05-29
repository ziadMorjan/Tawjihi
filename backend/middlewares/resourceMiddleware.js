const Course = require("../models/Course");
const Lesson = require("../models/Lesson")
const CustomError = require("../utils/CustomError");
const { asyncErrorHandler } = require("./errorMiddleware");

const checkResourceBelongToTeacher = asyncErrorHandler(async function (req, res, next) {
    let lesson = await Lesson.findById(req.params.lessonId);
    let course = await Course.findById(lesson.course);
    if (req.user.id !== course.teacher.id)
        throw new CustomError("This resource does not belong to you", 403);
    next();
});

module.exports = {
    checkResourceBelongToTeacher,
}