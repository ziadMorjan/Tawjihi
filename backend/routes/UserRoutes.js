const express = require('express');

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
        uploadUserImage,
        resizeUserImage,
        createUserValidator,
        createUser
    );

router.route("/:id")
    .get(getUserValidator, getUser)
    .patch(updateUserValidator, updateUser)
    .delete(deleteUserValidator, deleteUser);

module.exports = router;