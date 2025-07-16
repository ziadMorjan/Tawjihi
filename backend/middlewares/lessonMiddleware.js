const Course = require("../models/Course");
const Lesson = require("../models/Lesson")
const CustomError = require("../utils/CustomError");
const { asyncErrorHandler } = require("./errorMiddleware");


const checkCourseBelongToTeacherInCreate = asyncErrorHandler(async function (req, res, next) {
    let course = await Course.findById(req.body.course);
    if (req.user.id !== course.teacher.id)
        throw new CustomError("You can not add lectures, This course does not belong to you", 403);
    next();
});

const checkCourseBelongToTeacher = asyncErrorHandler(async function (req, res, next) {
    let lesson = await Lesson.findById(req.params.id);
    let course = await Course.findById(lesson.course);
    if (req.user.id !== course.teacher.id)
        throw new CustomError("This lessons belong to course that does not belong to you", 403);
    next();
});


const addCourseIdToReqBody = asyncErrorHandler(async function (req, res, next) {
    if (req.params.courseId)
        req.body.course = req.params.courseId;
    next();
});

const addCourseIdToReqQuery = asyncErrorHandler(async function (req, res, next) {
    if (req.params.courseId)
        req.query.course = req.params.courseId;
    next();
});

module.exports = {
    checkCourseBelongToTeacherInCreate,
    checkCourseBelongToTeacher,
    addCourseIdToReqBody,
    addCourseIdToReqQuery
}