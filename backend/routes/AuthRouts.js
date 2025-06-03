const express = require("express");
const passport = require("passport");
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
const { createToken } = require("../utils/JWTs");

let router = express.Router();

const oauthCallbackHandler = function (req, res) {
    const token = createToken(req.user.id);

    res.status(201).json({
        status: "success",
        user: req.user,
        token
    });
}

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback",
    passport.authenticate("google", { failureRedirect: '/', session: false }),
    oauthCallbackHandler
);

router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));
router.get("/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: '/', session: false }),
    oauthCallbackHandler
);

router.post(
    "/signup",
    uploadUserFiles,
    handleUserFiles,
    signupValidator,
    signup
);

router.post(
    "/login",
    loginValidator,
    login
);

router.post(
    "/forgetPassword",
    forgetPasswordValidator,
    forgetPassword
);

router.post(
    "/verifyResetCode",
    verifyResetCodValidator,
    verifyResetCod
);

router.patch(
    "/resetPassword",
    resetPasswordValidator,
    resetPassword
);

module.exports = router;