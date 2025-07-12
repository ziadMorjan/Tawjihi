const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const sharp = require("sharp");
const User = require("../models/User");
const { uploadMultipleFields } = require("../middlewares/uploadsMiddleware");
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
const Cart = require("../models/Cart");

const getAllUsers = getAll(User);

const createUser = createOne(User);

const getUser = getOne(User, "User");

const updateUser = updateOne(User, "User");

const deleteUser = deleteOne(User, "User");

const uploadUserFiles = uploadMultipleFields([{ name: "coverImage", maxCount: 1 }, { name: "cv", maxCount: 1 }]);

const handleUserFiles = asyncErrorHandler(async function (req, res, next) {
    if (req.files) {
        if (req.files.coverImage) {
            let { mimetype } = req.files.coverImage[0];
            if (!mimetype.startsWith("image"))
                throw new CustomError("invalid file type for cover image");

            let unique = crypto.randomUUID();
            let name = `user-${unique}-${Date.now()}.jpeg`;
            const uploadDir = path.join(__dirname, '..', 'uploads', 'images', 'users');
            // Ensure directory exists
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            const filePath = path.join(uploadDir, name);
            const buffer = await sharp(req.files.coverImage[0].buffer)
                .resize(500, 500)
                .toFormat("jpeg")
                .jpeg({ quality: 90 })
                .toBuffer();

            fs.writeFileSync(filePath, buffer);
            req.body.coverImage = name;
        }
        if (req.files.cv) {
            let { mimetype } = req.files.cv[0];
            if (!mimetype.endsWith("pdf"))
                throw new CustomError("invalid file type for cv");

            let unique = crypto.randomUUID();
            let name = `cv-${unique}-${Date.now()}.pdf`;
            const uploadDir = path.join(__dirname, '..', 'uploads', 'cvs');
            // Ensure directory exists
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            const filePath = path.join(uploadDir, name);
            fs.writeFileSync(filePath, req.files.cv[0].buffer);
            req.body.cv = name;
        }
    }
    next();
});


const deleteMe = asyncErrorHandler(async function (req, res) {
    await User.findByIdAndUpdate(req.params.id, { isActive: false });

    res.status(204).send();
});

const getMe = asyncErrorHandler(async function (req, res) {
    const user = await User.findById(req.user.id).select("-password -PasswordChangedAt");

    const cart = await Cart.findOne({ user: user.id });

    const userToRes = { ...user._doc, ...{ cart: cart.courses } };


    res.status(200).json({
        status: "success",
        user: userToRes
    });
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

    let emailBody = `Hi ${user.name}\n\n Unlucky we could not accept you to join us as a teacher,\n\n strength your cv and try to join us later`;

    if (user.isActive === true)
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
    uploadUserFiles,
    handleUserFiles,
    getAllUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
    changePassword,
    deleteMe,
    getMe,
    acceptTeacher,
    refuseTeacher
};