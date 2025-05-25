const express = require('express');

const {
    protect,
    allowedTo
} = require('../middlewares/authMiddleware');

let router = express.Router();

const {
    getSubjectValidator,
    createSubjectValidator,
    updateSubjectValidator,
    deleteSubjectValidator
} = require("../utils/validators/subjectValidator");

const {
    getAllSubjects,
    createSubject,
    getSubject,
    updateSubject,
    deleteSubject,
} = require("../controllers/SubjectController");

router.route("/")
    .get(getAllSubjects)
    .post(
        protect,
        allowedTo("admin"),
        createSubjectValidator,
        createSubject,
    );

router.route("/:id")
    .get(getSubjectValidator, getSubject)
    .patch(
        protect,
        allowedTo("admin"),
        updateSubjectValidator,
        updateSubject
    )
    .delete(
        protect,
        allowedTo("admin"),
        deleteSubjectValidator,
        deleteSubject
    );

module.exports = router;