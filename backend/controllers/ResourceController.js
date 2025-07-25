import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url'; // 👈 Add this import
import Lesson from '../models/Lesson.js';
import { asyncErrorHandler } from '../middlewares/errorMiddleware.js';
import { uploadSingleField } from '../middlewares/uploadsMiddleware.js';

// --- Recreate __dirname for ES Modules ---
const __filename = fileURLToPath(import.meta.url); // Gets the file path
const __dirname = path.dirname(__filename);     // Gets the directory path

export const uploadContentFile = uploadSingleField("content");

export const handleContentFile = asyncErrorHandler(async function (req, res, next) {
    if (req.file) {
        let { mimetype } = req.file;
        if (!mimetype.endsWith("pdf"))
            throw new CustomError("invalid file", 400);
        let unique = crypto.randomUUID();
        let name = `resource-${unique}-${Date.now()}.pdf`;
        const uploadDir = path.join(__dirname, '..', 'uploads', 'lessons', 'resources');
        // Ensure directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        const filePath = path.join(uploadDir, name);

        fs.writeFileSync(filePath, req.file.buffer);

        req.upload = "resource";
        req.filePath = filePath;
    }
    next();
});

export const getAllResource = asyncErrorHandler(async function (req, res) {
    let lesson = await Lesson.findById(req.params.lessonId);

    res.status(200).json({
        status: "success",
        count: lesson.resources.length,
        data: {
            resources: lesson.resources
        }
    });
});

export const createResource = asyncErrorHandler(async function (req, res) {
    let lesson = await Lesson.findByIdAndUpdate(
        req.params.lessonId,
        {
            $push: { resources: req.body }
        },
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(201).json({
        status: "success",
        count: lesson.resources.length,
        data: {
            resources: lesson.resources
        }
    });
});

export const getResource = asyncErrorHandler(async function (req, res) {
    let lesson = await Lesson.findById(req.params.lessonId);

    let [resource] = lesson.resources.filter(resource => resource._id.toString() === req.params.id);

    res.status(200).json({
        status: "success",
        data: {
            resource
        }
    });
});

export const updateResource = asyncErrorHandler(async function (req, res) {
    let lesson = await Lesson.findById(req.params.lessonId);
    let resourceIndex = lesson.resources.findIndex(resource => resource._id.toString() === req.params.id);

    if (req.body.name)
        lesson.resources[resourceIndex].name = req.body.name;

    if (req.body.content)
        lesson.resources[resourceIndex].content = req.body.content;

    await lesson.save();

    res.status(200).json({
        status: "success",
        data: {
            resource: lesson.resources[resourceIndex],
        }
    });
});

export const deleteResource = asyncErrorHandler(async function (req, res) {
    await Lesson.findByIdAndUpdate(req.params.lessonId,
        {
            $pull: { resources: { _id: req.params.id } }
        },
        {
            runValidators: true,
        });

    res.status(204).send();
});
