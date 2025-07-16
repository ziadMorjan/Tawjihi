const Review = require("../models/Review");
const CustomError = require("../utils/CustomError");
const { asyncErrorHandler } = require("./errorMiddleware");

const addCourseIdToReqQuery = (req, res, next) => {
    if (req.params.courseId)
        req.query.course = req.params.courseId;
    next();
}

const addCourseIdToReqBody = (req, res, next) => {
    if (req.params.courseId) {
        req.body.course = req.params.courseId;
    }
    next();
}

const addUserIdToReqBody = (req, res, next) => {
    req.body.user = req.user.id;
    next();
}

const deleteReviewMiddleware = asyncErrorHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id);
    if (!review) {
        throw new CustomError("No review found with that ID");
    }
    if (req.user.role === "user") {
        if (review.user.id !== req.user.id) {
            throw new CustomError("You are not authorized to delete this review", 403);
        }
    }
    if (req.user.role === "teacher") {
        if (review.course.teacher.id !== req.user.id) {
            throw new CustomError("You are not authorized to delete this review", 403);
        }
    }
    next();
});

module.exports = {
    addUserIdToReqBody,
    addCourseIdToReqBody,
    deleteReviewMiddleware,
    addCourseIdToReqQuery
};