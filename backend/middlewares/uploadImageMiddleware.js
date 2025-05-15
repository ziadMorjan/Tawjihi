const multer = require('multer');
const CustomError = require('../utils/CustomError');

const multerConfig = {
    storage: multer.memoryStorage(),
    filter: function (req, res, cb) {
        if (req.file && req.file.mimetype.startsWith("image")) {
            cb(null, true);
        } else {
            cb(new CustomError("Invalid file type", 400), false);
        }
    }
}
let upload = multer(multerConfig);

const uploadImage = (imageField) => upload.single(imageField);

module.exports = { uploadImage }