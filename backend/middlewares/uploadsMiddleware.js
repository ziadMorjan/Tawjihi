const multer = require('multer');

let upload = multer({
    storage: multer.memoryStorage()
});

const uploadSingleField = (fieldName) => upload.single(fieldName);

const uploadMultipleFields = fields => upload.fields(fields);

module.exports = { uploadSingleField, uploadMultipleFields }