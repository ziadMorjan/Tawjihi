const express = require('express');
const jwt = require("jsonwebtoken");
const {
    protect,
    allowedTo
} = require('../middlewares/authMiddleware');

const {
    addUserIdToReqParams,
    updateMeMiddleware,
    activationMiddleware
} = require("../middlewares/userMiddleware");

const {
    getUserValidator,
    createUserValidator,
    updateUserValidator,
    deleteUserValidator,
    changePasswordValidator,
    activateUserValidator,
    deactivateUserValidator,
    acceptTeacherValidator,
    refuseTeacherValidator
} = require("../utils/validators/userValidator");

const {
    getAllUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
    uploadUserFiles,
    handleUserFiles,
    deleteMe,
    changePassword,
    acceptTeacher,
    refuseTeacher
} = require("../controllers/UserController");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Public route for reading token from cookie (OAuth login support)
router.get("/public-me", (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized - no token" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return res.json({ user: decoded.id, token });
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
});

router.route("/deleteMe")
    .delete(
        protect,
        allowedTo("user", "teacher"),
        addUserIdToReqParams,
        deleteMe
    );

router.route("/updateMe")
    .patch(
        protect,
        allowedTo("admin", "user", "teacher"),
        addUserIdToReqParams,
        updateMeMiddleware,
        uploadUserFiles,
        handleUserFiles,
        updateUserValidator,
        updateUser
    );

router.route("/changePassword")
    .patch(
        protect,
        allowedTo("admin", "user", "teacher"),
        addUserIdToReqParams,
        changePasswordValidator,
        changePassword
    );

router.route("/me")
    .get(
        protect,
        allowedTo("admin", "user", "teacher"),
        addUserIdToReqParams,
        getUserValidator,
        getUser
    );

router.route("/")
    .get(getAllUsers)
    .post(
        protect,
        allowedTo("admin"),
        uploadUserFiles,
        handleUserFiles,
        createUserValidator,
        createUser
    );

router.route("/:id/activate")
    .patch(
        protect,
        allowedTo("admin"),
        activateUserValidator,
        activationMiddleware(true),
        updateUser
    );

router.route("/:id/deactivate")
    .patch(
        protect,
        allowedTo("admin"),
        deactivateUserValidator,
        activationMiddleware(false),
        updateUser
    );

router.route("/:id/acceptTeacher")
    .patch(
        protect,
        allowedTo("admin"),
        acceptTeacherValidator,
        activationMiddleware(true),
        acceptTeacher
    );

router.route("/:id/refuseTeacher")
    .delete(
        protect,
        allowedTo("admin"),
        refuseTeacherValidator,
        refuseTeacher
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
        uploadUserFiles,
        handleUserFiles,
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
