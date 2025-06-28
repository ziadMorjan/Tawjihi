const express = require('express');

const { protect, allowedTo } = require("../middlewares/authMiddleware");

const {
    checkCourseBelongToTeacher,
    checkCourseBelongToTeacherInCreate,
    addCourseIdToReqBody
} = require("../middlewares/lessonMiddleware");

const {
    createLessonValidator,
    getLessonValidator,
    updateLessonValidator,
    deleteLessonValidator
} = require("../utils/validators/lessonValidator");

const {
    getAllLessons,
    createLesson,
    getLesson,
    updateLesson,
    deleteLesson,
    uploadLessonVideo,
    handVideo
} = require('../controllers/LessonController');
const resourceRouts = require('./ResourceRouts');
const commentsRouts = require('./CommentRoutes');

let router = express.Router({ mergeParams: true });

router.use("/:lessonId/resources", resourceRouts);
router.use("/:lessonId/comments", commentsRouts);

router.route('/')
    .get(getAllLessons)
    .post(
        protect,
        allowedTo("teacher"),
        uploadLessonVideo,
        handVideo,
        addCourseIdToReqBody,
        createLessonValidator,
        checkCourseBelongToTeacherInCreate,
        createLesson
    );

router.route('/:id')
    .get(getLessonValidator, getLesson)
    .patch(
        protect,
        allowedTo("teacher"),
        checkCourseBelongToTeacher,
        uploadLessonVideo,
        handVideo,
        addCourseIdToReqBody,
        updateLessonValidator,
        updateLesson
    )
    .delete(
        protect,
        allowedTo("teacher"),
        addCourseIdToReqBody,
        checkCourseBelongToTeacher,
        deleteLessonValidator,
        deleteLesson
    );

module.exports = router;