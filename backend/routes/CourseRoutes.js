const express = require('express');

const lessonRouts = require("./LessonRouts");

const reviewsRouts = require("./ReviewRoutes");

const {
    protect,
    allowedTo
} = require('../middlewares/authMiddleware');

const { checkCourseBelongToTeacher } = require("../middlewares/courseMiddleware");

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
    deleteCourse,
    uploadCourseImage,
    handleCourseImage
} = require('../controllers/CourseController');

let router = express.Router();

router.use("/:courseId/lessons", lessonRouts);

router.use("/:courseId/reviews", reviewsRouts);

router.route('/')
    .get(getAllCourses)
    .post(
        protect,
        allowedTo('teacher'),
        uploadCourseImage,
        handleCourseImage,
        createCourseValidator,
        createCourse,
    );

router.route('/:id')
    .get(getCourseValidator, getCourse)
    .patch(
        protect,
        allowedTo('teacher'),
        uploadCourseImage,
        handleCourseImage,
        updateCourseValidator,
        checkCourseBelongToTeacher,
        updateCourse,
    )
    .delete(
        protect,
        allowedTo('teacher', 'admin'),
        deleteCourseValidator,
        checkCourseBelongToTeacher,
        deleteCourse,
    );

module.exports = router;