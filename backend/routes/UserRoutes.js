const express = require('express');

let router = express.Router();

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
} = require("../controllers/UserController");

router.route("/")
    .get(getAllUsers)
    .post(createUserValidator, createUser);

router.route("/:id")
    .get(getUserValidator, getUser)
    .patch(updateUserValidator, updateUser)
    .delete(deleteUserValidator, deleteUser);

module.exports = router;