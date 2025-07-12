const express = require("express");

const {
    protect,
    allowedTo
} = require('../middlewares/authMiddleware');

const {
    createNewValidator,
    updateNewValidator,
    getNewValidator,
    deleteNewValidator
} = require("../utils/validators/newsValidator");

const {
    getAllNews,
    createNew,
    getNew,
    updateNew,
    deleteNew,
    uploadNewCoverImage,
    handleNewCoverImage
} = require("../controllers/NewController");

let router = express.Router();

router.route("/")
    .get(getAllNews)
    .post(
        protect,
        allowedTo("admin"),
        uploadNewCoverImage,
        handleNewCoverImage,
        createNewValidator,
        createNew,
    );

router.route("/:id")
    .get(getNewValidator, getNew)
    .patch(
        protect,
        allowedTo("admin"),
        uploadNewCoverImage,
        handleNewCoverImage,
        updateNewValidator,
        updateNew,
    )
    .delete(
        protect,
        allowedTo("admin"),
        deleteNewValidator,
        deleteNew
    );

module.exports = router;