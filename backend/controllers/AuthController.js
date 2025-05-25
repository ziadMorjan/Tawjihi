const bcryptjs = require("bcryptjs");
const User = require("../models/User");
const { asyncErrorHandler } = require("../middlewares/errorMiddleware");
const { createToken } = require("../utils/JWTs");
const CustomError = require("../utils/CustomError");

const signup = asyncErrorHandler(async function (req, res) {
    let user = await User.create(req.body);

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

module.exports = {
    signup,
    login
}
