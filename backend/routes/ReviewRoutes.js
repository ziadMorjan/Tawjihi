const express = require('express');
const { protect, allowedTo } = require('../middlewares/authMiddleware');
const {
    addUserIdToReqBody,
    addCourseIdToReqBody,
    deleteReviewMiddleware,
    addCourseIdToReqQuery
} = require('../middlewares/reviewMiddleware');
const {
    createReviewValidator,
    getReviewValidator,
    updateReviewValidator,
    deleteReviewValidator
} = require('../utils/validators/reviewValidator');
const {
    getAllReviews,
    createReview,
    getReview,
    updateReview,
    deleteReview
} = require('../controllers/ReviewController');

const router = express.Router({ mergeParams: true });

// Routes for Review
router.route('/')
    .get(
        addCourseIdToReqQuery,
        getAllReviews
    )
    .post(
        protect,
        allowedTo('user'),
        addUserIdToReqBody,
        addCourseIdToReqBody,
        createReviewValidator,
        createReview
    );

router.route('/:id')
    .get(getReviewValidator, getReview)
    .patch(
        protect,
        allowedTo('user'),
        addUserIdToReqBody,
        addCourseIdToReqBody,
        updateReviewValidator,
        updateReview
    )
    .delete(
        protect,
        deleteReviewValidator,
        deleteReviewMiddleware,
        deleteReview
    );

module.exports = router;
