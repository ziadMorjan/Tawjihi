const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const sharp = require("sharp");
const New = require('../models/New');
const {
    getAll,
    createOne,
    getOne,
    updateOne,
    deleteOne
} = require("./controller");
const { uploadSingleField } = require("../middlewares/uploadsMiddleware");
const { asyncErrorHandler } = require('../middlewares/errorMiddleware');
const CustomError = require("../utils/CustomError");

const getAllNews = getAll(New);

const createNew = createOne(New);

const getNew = getOne(New, "new");

const updateNew = updateOne(New, "new");

const deleteNew = deleteOne(New, "new");


const uploadNewCoverImage = uploadSingleField("coverImage");

const handleNewCoverImage = asyncErrorHandler(async function (req, res, next) {
    if (req.file) {
        let { mimetype } = req.file;
        if (!mimetype.startsWith("image"))
            throw new CustomError("invalid file type for cover image");

        let unique = crypto.randomUUID();
        let name = `new-${unique}-${Date.now()}.jpeg`;
        const uploadDir = path.join(__dirname, '..', 'uploads', 'images', 'news');
        // Ensure directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        const filePath = path.join(uploadDir, name);
        const buffer = await sharp(req.file.buffer)
            .resize(500, 500)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toBuffer();

        fs.writeFileSync(filePath, buffer);

        req.upload = "new";
        req.filePath = filePath;
    }
    next();
});


module.exports = {
    getAllNews,
    createNew,
    getNew,
    updateNew,
    deleteNew,
    uploadNewCoverImage,
    handleNewCoverImage
}