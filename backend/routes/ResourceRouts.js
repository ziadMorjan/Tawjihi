const express = require("express");
const { protect, allowedTo } = require("../middlewares/authMiddleware");
const { checkResourceBelongToTeacher } = require("../middlewares/resourceMiddleware");
const {
    getAllResourceValidator,
    createResourceValidator,
    getResourceValidator,
    updateResourceValidator,
    deleteResourceValidator
} = require("../utils/validators/resourceValidator");
const {
    getAllResource,
    createResource,
    getResource,
    updateResource,
    deleteResource,
    uploadContentFile,
    handleContentFile
} = require("../controllers/ResourceController");

let router = express.Router({ mergeParams: true });

router.route("/")
    .get(
        getAllResourceValidator,
        getAllResource
    )
    .post(
        protect,
        allowedTo("teacher"),
        checkResourceBelongToTeacher,
        uploadContentFile,
        handleContentFile,
        createResourceValidator,
        createResource
    );

router.route("/:id")
    .get(
        getResourceValidator,
        getResource
    ).patch(
        protect,
        allowedTo("teacher"),
        checkResourceBelongToTeacher,
        uploadContentFile,
        handleContentFile,
        updateResourceValidator,
        updateResource
    ).delete(
        protect,
        allowedTo("teacher"),
        checkResourceBelongToTeacher,
        deleteResourceValidator,
        deleteResource
    );

module.exports = router;