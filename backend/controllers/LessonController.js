import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { getVideoDurationInSeconds } from 'get-video-duration';
import Lesson from '../models/Lesson.js';
import { asyncErrorHandler } from '../middlewares/errorMiddleware.js';
import { uploadSingleField } from '../middlewares/uploadsMiddleware.js';
import { getAll, createOne, getOne, updateOne, deleteOne } from './controller.js';

// --- Recreate __dirname for ES Modules ---
const __filename = fileURLToPath(import.meta.url); // Gets the file path
const __dirname = path.dirname(__filename);     // Gets the directory path


export const uploadLessonVideo = uploadSingleField("video");

export const handleVideo = asyncErrorHandler(async function (req, res, next) {
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
        req.body.duration = duration;

        req.upload = "lesson";
        req.filePath = filePath;
    }
    next();
});


export const getAllLessons = getAll(Lesson);

export const createLesson = createOne(Lesson);

export const getLesson = getOne(Lesson, "Lesson");

export const updateLesson = updateOne(Lesson, "Lesson");

export const deleteLesson = deleteOne(Lesson, "Lesson");
