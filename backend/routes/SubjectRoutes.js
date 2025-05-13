const express = require('express');

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
    .post(createSubjectValidator, createSubject);

router.route("/:id")
    .get(getSubjectValidator, getSubject)
    .patch(updateSubjectValidator, updateSubject)
    .delete(deleteSubjectValidator, deleteSubject);

module.exports = router;