const express = require("express");

const {
    uploadUserImage,
    resizeUserImage,
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
        uploadUserImage,
        resizeUserImage,
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