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

module.exports = {
    uploadUserImage,
    resizeUserImage,
    getAllUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
};