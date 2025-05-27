const express = require("express");

const {
    uploadUserFiles,
    handleUserFiles
} = require("../controllers/UserController");

const {
    signupValidator,
    loginValidator,
    forgetPasswordValidator,
    verifyResetCodValidator,
    resetPasswordValidator
} = require("../utils/validators/authValidator");

const {
    signup,
    login,
    forgetPassword,
    verifyResetCod,
    resetPassword
} = require("../controllers/AuthController");

let router = express.Router();

router.route("/signup")
    .post(
        uploadUserFiles,
        handleUserFiles,
        signupValidator,
        signup
    );

router.route("/login")
    .post(
        loginValidator,
        login
    );

router.route("/forgetPassword")
    .post(
        forgetPasswordValidator,
        forgetPassword
    );

router.route("/verifyResetCode")
    .post(
        verifyResetCodValidator,
        verifyResetCod
    );

router.route("/resetPassword")
    .patch(
        resetPasswordValidator,
        resetPassword
    );

module.exports = router;