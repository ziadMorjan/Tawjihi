const express = require("express");
const { protect, allowedTo } = require("../middlewares/authMiddleware");
const {
    addUserToReqBody,
    deleteEnrollmentMiddleware
} = require("../middlewares/enrollmentMiddleware");

const {
    createEnrollmentValidator,
    getEnrollmentValidator,
    updateEnrollmentValidator,
    deleteEnrollmentValidator
} = require("../utils/validators/enrollmentValidator");

const {
    getAllEnrollments,
    createEnrollment,
    getEnrollment,
    updateEnrollment,
    deleteEnrollment
} = require("../controllers/EnrollmentController");

let router = express.Router();

router.route("/")
    .get(getAllEnrollments)
    .post(
        protect,
        allowedTo("user"),
        addUserToReqBody,
        createEnrollmentValidator,
        createEnrollment
    );

router.route("/:id")
    .get(
        getEnrollmentValidator,
        getEnrollment
    )
    .patch(
        protect,
        allowedTo("admin"),
        updateEnrollmentValidator,
        updateEnrollment
    )
    .delete(
        protect,
        deleteEnrollmentMiddleware,
        deleteEnrollmentValidator,
        deleteEnrollment
    );



module.exports = router;