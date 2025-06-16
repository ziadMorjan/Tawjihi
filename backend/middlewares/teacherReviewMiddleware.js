const TeacherReview = require("../models/TeacherReview");
const CustomError = require("../utils/CustomError");
const { asyncErrorHandler } = require("./errorMiddleware");

const addTeacherIdToReqBody = (req, res, next) => {
    if (req.params.teacherId) {
        req.body.teacher = req.params.teacherId;
    }
    next();
}

const addUserIdToReqBody = (req, res, next) => {
    req.body.user = req.user.id;
    next();
}

const deleteTeacherReviewMiddleware = asyncErrorHandler(async (req, res, next) => {
    const tReview = await TeacherReview.findById(req.params.id);
    if (!tReview) {
        throw new CustomError("No review found with that ID");
    }
    if (req.user.role === "user") {
        if (tReview.user.id !== req.user.id) {
            throw new CustomError("You are not authorized to delete this review", 403);
        }
    }
    next();
});

module.exports = {
    addUserIdToReqBody,
    addTeacherIdToReqBody,
    deleteTeacherReviewMiddleware
};