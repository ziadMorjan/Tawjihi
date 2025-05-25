const express = require('express');

const {
    protect,
    allowedTo
} = require('../middlewares/authMiddleware');

const {
    getUserValidator,
    createUserValidator,
    updateUserValidator,
    deleteUserValidator
} = require("../utils/validators/userValidator");

const {
    getAllUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
    uploadUserImage,
    resizeUserImage
} = require("../controllers/UserController");

let router = express.Router();

router.route("/")
    .get(getAllUsers)
    .post(
        protect,
        allowedTo("admin"),
        uploadUserImage,
        resizeUserImage,
        createUserValidator,
        createUser
    );

router.route("/:id")
    .get(
        protect,
        allowedTo("admin"),
        getUserValidator,
        getUser
    )
    .patch(
        protect,
        allowedTo("admin"),
        uploadUserImage,
        resizeUserImage,
        updateUserValidator,
        updateUser
    )
    .delete(
        protect,
        allowedTo("admin"),
        deleteUserValidator,
        deleteUser
    );

module.exports = router;