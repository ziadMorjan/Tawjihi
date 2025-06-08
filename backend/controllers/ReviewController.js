const Review = require('../models/Review');
const {
    getAll,
    createOne,
    getOne,
    updateOne,
    deleteOne
} = require('./controller');

const getAllReviews = getAll(Review);

const createReview = createOne(Review);

const getReview = getOne(Review, "Review");

const updateReview = updateOne(Review, "Review");

const deleteReview = deleteOne(Review, "Review");

module.exports = {
    getAllReviews,
    createReview,
    getReview,
    updateReview,
    deleteReview
};
