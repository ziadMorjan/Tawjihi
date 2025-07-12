const crypto = require("crypto");
const bcryptjs = require("bcryptjs");
const User = require("../models/User");
const { asyncErrorHandler } = require("../middlewares/errorMiddleware");
const { createToken } = require("../utils/JWTs");
const CustomError = require("../utils/CustomError");
const { sendEmail } = require("../utils/emails");
const Cart = require("../models/Cart");

const sendAuthRes = async function (res, user, statusCode) {
    const token = createToken(user.id);
    const isDev = process.env.NODE_ENV !== 'production';
    const options = {
        httpOnly: true,
        sameSite: isDev ? 'Lax' : 'None',
        secure: !isDev,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    let cart = await Cart.findOne({ user: user.id });
    if (!cart) {
        cart = await Cart.create({ user: user.id });
    }

    const userToRes = { ...user._doc, ...{ cart: cart.courses } };
    delete userToRes.password;

    res.cookie('token', token, options);

    res.status(statusCode).json({
        status: "success",
        user: userToRes
    });
}

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
    sendAuthRes(res, user, 201);
});

const login = asyncErrorHandler(async function (req, res) {
    let user = await User.findOne({ email: req.body.email }).select("+password");

    if (!user.isActive || !bcryptjs.compareSync(req.body.password, user.password))
        throw new CustomError("Wrong email or password", 400);

    sendAuthRes(res, user, 200);
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

    sendAuthRes(res, user, 201);
});

const logout = (req, res) => {
    const isDev = process.env.NODE_ENV !== 'production';
    const options = {
        httpOnly: true,
        sameSite: isDev ? 'Lax' : 'None',
        secure: !isDev,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    };
    res.clearCookie("token", options);
    res.status(200).json({
        status: "success",
        message: "Logged out"
    });
}

module.exports = {
    signup,
    login,
    forgetPassword,
    verifyResetCod,
    resetPassword,
    logout
}
