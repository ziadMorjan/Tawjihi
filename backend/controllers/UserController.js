const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const sharp = require("sharp");
const User = require("../models/User");
const { uploadImage } = require("../middlewares/uploadImageMiddleware");
const {
    getAll,
    createOne,
    getOne,
    updateOne,
    deleteOne,
} = require("./controller");
const { asyncErrorHandler } = require("../middlewares/errorMiddleware");
const { createToken } = require("../utils/JWTs");
const CustomError = require("../utils/CustomError");
const { sendEmail } = require("../utils/emails");

const uploadUserImage = uploadImage("coverImage");

const resizeUserImage = asyncErrorHandler(async function (req, res, next) {
    if (req.file) {
        let unique = crypto.randomUUID();
        let name = `user-${unique}-${Date.now()}.jpeg`;
        const uploadDir = path.join(__dirname, '..', 'uploads', 'images', 'users');
        // Ensure directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        const filePath = path.join(uploadDir, name);
        await sharp(req.file.buffer)
            .resize(500, 500)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(filePath);

        req.body.coverImage = name;
    }
    next();
});

const getAllUsers = getAll(User);

const createUser = createOne(User);

const getUser = getOne(User, "User");

const updateUser = updateOne(User, "User");

const deleteUser = deleteOne(User, "User");

const deleteMe = asyncErrorHandler(async function (req, res) {
    await User.findByIdAndUpdate(req.params.id, { isActive: false });

    res.status(204).send();
});

const changePassword = asyncErrorHandler(async function (req, res) {
    let user = await User.findById(req.params.id);

    user.password = req.body.newPassword;
    user.PasswordChangedAt = Date.now();
    user.save();

    let token = createToken(user.id);

    res.status(200).json({
        status: "success",
        token
    });
});

let acceptTeacher = asyncErrorHandler(async function (req, res) {
    let user = await User.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: true,
        new: true
    });

    if (!user)
        throw new CustomError("No teacher found", 404);

    if (user.role !== "teacher")
        throw new CustomError("this user is not a teacher", 400);

    if (user.isActive)
        throw new CustomError("this teacher is already active", 400);

    let emailBody = `Hi ${user.name}\n\n we have accepted you to join us as a teacher you can login now using your email and password`;

    let options = {
        from: "Tawjihi support",
        to: user.email,
        subject: "Accepted as a teacher",
        text: emailBody
    };

    try {
        await sendEmail(options);
        res.status(200).json({ status: "success" });
    } catch (error) {
        throw new CustomError("Some thing wrong happened in sending the email", 500);
    }
});

let refuseTeacher = asyncErrorHandler(async function (req, res) {
    let user = await User.findByIdAndDelete(req.params.id);

    if (!user)
        throw new CustomError("No teacher found", 404);

    if (user.role !== "teacher")
        throw new CustomError("this user is not a teacher", 400);

    let emailBody = `Hi ${user.name}\n\n Unlucky we could not accept you to join us as a teacher,\n\n strength your cv and try to join us later`;

    if (user.isActive)
        emailBody = `Hi ${user.name}\n\n Unlucky we will refuse you teacher`;

    let options = {
        from: "Tawjihi support",
        to: user.email,
        subject: "Not accepted as a teacher",
        text: emailBody
    };

    try {
        await sendEmail(options);
        res.status(204).send();
    } catch (error) {
        throw new CustomError("Some thing wrong happened in sending the email", 500);
    }
});

module.exports = {
    uploadUserImage,
    resizeUserImage,
    getAllUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
    changePassword,
    deleteMe,
    acceptTeacher,
    refuseTeacher
};