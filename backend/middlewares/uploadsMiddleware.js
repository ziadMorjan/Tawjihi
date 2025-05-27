const multer = require('multer');

let upload = multer({
    storage: multer.memoryStorage()
});

const uploadSingleImage = (imageField) => upload.single(imageField);

const uploadMultipleFields = fields => upload.fields(fields);

module.exports = { uploadSingleImage, uploadMultipleFields }