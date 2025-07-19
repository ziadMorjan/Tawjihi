const express = require('express');
const { protect, allowedTo } = require('../middlewares/authMiddleware');
const {
    addUserIdToReqBody,
    addTeacherIdToReqBody,
    deleteTeacherReviewMiddleware,
    addTeacherIdToReqQuery
} = require('../middlewares/teacherReviewMiddleware');
const {
    createTeacherReviewValidator,
    getTeacherReviewValidator,
    updateTeacherReviewValidator,
    deleteTeacherReviewValidator
} = require('../utils/validators/teacherReviewValidator');
const {
    getAllTeacherReviews,
    createTeacherReview,
    getTeacherReview,
    updateTeacherReview,
    deleteTeacherReview
} = require('../controllers/TeacherReviewController');

const router = express.Router({ mergeParams: true });

// Routes for TeacherReview
router.route('/')
    .get(
        addTeacherIdToReqQuery,
        getAllTeacherReviews
    )
    .post(
        protect,
        allowedTo('user'),
        addUserIdToReqBody,
        addTeacherIdToReqBody,
        createTeacherReviewValidator,
        createTeacherReview
    );

router.route('/:id')
    .get(getTeacherReviewValidator, getTeacherReview)
    .patch(
        protect,
        allowedTo('user'),
        addUserIdToReqBody,
        addTeacherIdToReqBody,
        updateTeacherReviewValidator,
        updateTeacherReview
    )
    .delete(
        protect,
        allowedTo('user', 'admin'),
        deleteTeacherReviewValidator,
        deleteTeacherReviewMiddleware,
        deleteTeacherReview
    );

module.exports = router;
