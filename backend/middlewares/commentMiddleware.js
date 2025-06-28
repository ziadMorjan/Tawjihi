const Comment = require("../models/Comment");
const Lesson = require("../models/Lesson");
const Course = require("../models/Course");
const CustomError = require("../utils/CustomError");
const { asyncErrorHandler } = require("./errorMiddleware");

const addLessonIdToReqBody = (req, res, next) => {
    if (req.params.lessonId) {
        req.body.lesson = req.params.lessonId;
    }
    next();
}

const addUserIdToReqBody = (req, res, next) => {
    req.body.user = req.user.id;
    next();
}

const checkCommentBelongToUser = asyncErrorHandler(async (req, res, next) => {
    if (req.user.role === "user") {
        const comment = await Comment.findById(req.params.id);
        if (comment)
            if (comment.user.id !== req.user.id)
                throw new CustomError("This comment does not belong to you.", 403)
    }
    next();
});

const checkCourseBelongToTeacher = asyncErrorHandler(async (req, res, next) => {
    if (req.user.role === "teacher") {
        const comment = await Comment.findById(req.params.id);
        if (comment) {
            const lesson = await Lesson.findById(comment.lesson.id);
            if (lesson) {
                const course = await Course.findById(lesson.course);
                if (course.teacher.id !== req.user.id)
                    throw new CustomError("This comment is on lesson on course does not belong to you.", 403)
            }
        }
    }
    next();
});


module.exports = {
    addUserIdToReqBody,
    addLessonIdToReqBody,
    checkCommentBelongToUser,
    checkCourseBelongToTeacher
};