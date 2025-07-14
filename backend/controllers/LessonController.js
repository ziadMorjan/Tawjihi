const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { getVideoDurationInSeconds } = require("get-video-duration");
const Lesson = require('../models/Lesson');
const { uploadSingleField } = require("../middlewares/uploadsMiddleware");

const {
    getAll,
    createOne,
    getOne,
    updateOne,
    deleteOne
} = require("./controller");
const { asyncErrorHandler } = require("../middlewares/errorMiddleware");
const CustomError = require("../utils/CustomError");
const cloudinary = require("../config/cloudinary");

const uploadLessonVideo = uploadSingleField("video");

const handleVideo = asyncErrorHandler(async function (req, res, next) {
    if (req.file) {
        let { mimetype } = req.file;
        if (!mimetype.startsWith("video"))
            throw new CustomError("invalid file type for video", 400);

        let unique = crypto.randomUUID();
        let ext = mimetype.split("/")[1];
        let name = `lesson-${unique}-${Date.now()}.${ext}`;
        const uploadDir = path.join(__dirname, '..', 'uploads', 'lessons', 'videos');
        // Ensure directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, name);
        fs.writeFileSync(filePath, req.file.buffer);
        const duration = Math.round(await getVideoDurationInSeconds(filePath));

        const result = await cloudinary.uploader.upload(filePath, {
            folder: "videos/lessons",
            resource_type: "video",
            type: "upload",
            access_mode: "public"
        });

        if (!result.secure_url) {
            fs.unlinkSync(filePath);
            throw new CustomError("Failed to upload video to cloud", 500);
        }

        fs.unlinkSync(filePath);

        req.body.duration = duration;
        req.body.video = result.secure_url;
    }
    next();
});


const getAllLessons = getAll(Lesson);

const createLesson = createOne(Lesson);

const getLesson = getOne(Lesson, "Lesson");

const updateLesson = updateOne(Lesson, "Lesson");

const deleteLesson = deleteOne(Lesson, "Lesson");


module.exports = {
    getAllLessons,
    createLesson,
    getLesson,
    updateLesson,
    deleteLesson,
    uploadLessonVideo,
    handleVideo
}