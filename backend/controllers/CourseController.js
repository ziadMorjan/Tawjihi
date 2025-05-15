const {
    getAll,
    createOne,
    getOne,
    updateOne,
    deleteOne
} = require('./controller');
const Course = require('../models/Course');

const getAllCourses = getAll(Course);

const createCourse = createOne(Course);

const getCourse = getOne(Course, "Course");

const updateCourse = updateOne(Course, "Course");

const deleteCourse = deleteOne(Course, "Course");

module.exports = {
    getAllCourses,
    createCourse,
    getCourse,
    updateCourse,
    deleteCourse
}
