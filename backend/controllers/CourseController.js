const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const sharp = require("sharp");
const { uploadSingleField } = require("../middlewares/uploadsMiddleware");
const {
    getAll,
    createOne,
    getOne,
    updateOne,
    deleteOne
} = require('./controller');
const Course = require('../models/Course');
const { asyncErrorHandler } = require("../middlewares/errorMiddleware");


const uploadCourseImage = uploadSingleField("coverImage");

const handleCourseImage = asyncErrorHandler(async function (req, res, next) {
    if (req.file) {
        let unique = crypto.randomUUID();
        let name = `course-${unique}-${Date.now()}.jpeg`;
        const uploadDir = path.join(__dirname, '..', 'uploads', 'images', 'courses');
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
        req.upload = "course";
        req.filePath = filePath;
    }
    next();
});


const getAllCourses = getAll(Course);

const createCourse = createOne(Course);

const getCourse = getOne(Course, "Course");

const updateCourse = updateOne(Course, "Course");

const deleteCourse = deleteOne(Course, "Course");

module.exports = {
    getAllCourses,
    createCourse,
    getCourse,
    updateCourse,
    deleteCourse,
    uploadCourseImage,
    handleCourseImage
}
