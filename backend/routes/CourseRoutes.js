const express = require('express');

const {
    createCourseValidator,
    updateCourseValidator,
    getCourseValidator,
    deleteCourseValidator
} = require('../utils/validators/courseValidator');

const {
    getAllCourses,
    createCourse,
    getCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/CourseController');

let router = express.Router();

router.route('/')
    .get(getAllCourses)
    .post(createCourseValidator, createCourse);

router.route('/:id')
    .get(getCourseValidator, getCourse)
    .patch(updateCourseValidator, updateCourse)
    .delete(deleteCourseValidator, deleteCourse);

module.exports = router;