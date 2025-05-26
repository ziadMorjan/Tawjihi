const crypto = require("crypto");
const bcryptjs = require("bcryptjs");
const User = require("../models/User");
const { asyncErrorHandler } = require("../middlewares/errorMiddleware");
const { createToken } = require("../utils/JWTs");
const CustomError = require("../utils/CustomError");
const { sendEmail } = require("../utils/emails");

const signup = asyncErrorHandler(async function (req, res, next) {
    if (req.body.role === "teacher")
        req.body.isActive = false;

    let user = await User.create(req.body);

    if (user.role === "teacher") {
        return res.status(201).json({
            status: "success",
            message: "We reive your request to join us as a teacher, we will contact with you in 24 hours",
        });
    }

    let token = createToken(user.id);

    res.status(201).json({
        status: "success",
        user,
        token
    });
});

const login = asyncErrorHandler(async function (req, res) {
    let user = await User.findOne({ email: req.body.email }).select("+password");

    if (!user.isActive || !bcryptjs.compareSync(req.body.password, user.password))
        throw new CustomError("Wrong email or password", 400);

    let token = createToken(user.id);

    res.status(200).json({
        status: "success",
        token
    });

});

const forgetPassword = asyncErrorHandler(async function (req, res) {
    let user = await User.findOne({ email: req.body.email });

    let resetCode = crypto.randomInt(100000, 999999);

    user.resetPasswordCode = crypto.createHash("sha256").update(resetCode.toString()).digest("hex");
    user.resetPasswordCodeExpired = Date.now() + 15 * 60 * 1000;
    user.resetPasswordCodeVerified = false;
    await user.save();

    let emailBody = `Hi ${user.name}!\nWe receive your request to reset your, use the bellow code to reset your password.\n\n${resetCode}\n\nthis code is valid for 15 minuets`;

    let options = {
        from: "Tawjihi Support",
        to: user.email,
        subject: "Reset password",
        text: emailBody
    }

    try {
        await sendEmail(options);
    } catch (error) {
        user.resetPasswordCode = undefined;
        user.resetPasswordCodeExpired = undefined;
        user.resetPasswordCodeVerified = undefined;
        await user.save();
        throw new CustomError("Sending email failed", 500);

    }

    res.status(200).json({
        status: "success",
        message: "Reset password code has sent to your email"
    });
});

const verifyResetCod = asyncErrorHandler(async function (req, res) {
    let hashedResetCode = crypto.createHash("sha256").update(req.body.resetCode.toString()).digest("hex");

    let user = await User.findOne({
        resetPasswordCode: hashedResetCode,
        resetPasswordCodeExpired: { $gte: Date.now() }
    });

    if (!user)
        throw new CustomError("No user found", 404);

    user.resetPasswordCodeVerified = true;
    await user.save();

    res.status(200).json({
        status: "success",
        message: "You can reset password now"
    });
});

const resetPassword = asyncErrorHandler(async function (req, res) {
    let user = await User.findOne({ email: req.body.email });

    if (!user.resetPasswordCodeVerified)
        throw new CustomError("You have not verify the reset code yet", 403);

    user.password = req.body.newPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordCodeExpired = undefined;
    user.resetPasswordCodeVerified = undefined;
    user.PasswordChangedAt = Date.now();
    await user.save();

    let token = createToken(user.id);

    res.status(200).json({
        status: "success",
        token
    });
});

module.exports = {
    signup,
    login,
    forgetPassword,
    verifyResetCod,
    resetPassword
}
