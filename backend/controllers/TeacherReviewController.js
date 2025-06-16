const TeacherReview = require('../models/TeacherReview');
const {
    getAll,
    createOne,
    getOne,
    updateOne,
    deleteOne
} = require('./controller');

const getAllTeacherReviews = getAll(TeacherReview);

const createTeacherReview = createOne(TeacherReview);

const getTeacherReview = getOne(TeacherReview, "TeacherReview");

const updateTeacherReview = updateOne(TeacherReview, "TeacherReview");

const deleteTeacherReview = deleteOne(TeacherReview, "TeacherReview");

module.exports = {
    getAllTeacherReviews,
    createTeacherReview,
    getTeacherReview,
    updateTeacherReview,
    deleteTeacherReview
};
