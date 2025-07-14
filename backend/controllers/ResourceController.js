const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const Lesson = require("../models/Lesson");
const { asyncErrorHandler } = require("../middlewares/errorMiddleware");
const { uploadSingleField } = require("../middlewares/uploadsMiddleware");
const CustomError = require("../utils/CustomError");
const cloudinary = require("../config/cloudinary");

const uploadContentFile = uploadSingleField("content");

const handleContentFile = asyncErrorHandler(async function (req, res, next) {
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

        const result = await cloudinary.uploader.upload(filePath, {
            folder: "files/resources",
            resource_type: "raw",
            format: "pdf",
            type: "upload",
            access_mode: "public"
        });

        if (!result.secure_url) {
            fs.unlinkSync(filePath);
            throw new CustomError("Failed to upload video to cloud", 500);
        }

        fs.unlinkSync(filePath);

        req.body.content = result.secure_url;
    }
    next();
});

const getAllResource = asyncErrorHandler(async function (req, res) {
    let lesson = await Lesson.findById(req.params.lessonId);

    res.status(200).json({
        status: "success",
        count: lesson.resources.length,
        data: {
            resources: lesson.resources
        }
    });
});

const createResource = asyncErrorHandler(async function (req, res) {
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

const getResource = asyncErrorHandler(async function (req, res) {
    let lesson = await Lesson.findById(req.params.lessonId);

    let [resource] = lesson.resources.filter(reso => reso._id.toString() === req.params.id);

    res.status(200).json({
        status: "success",
        data: {
            resource
        }
    });
});

const updateResource = asyncErrorHandler(async function (req, res) {
    let lesson = await Lesson.findById(req.params.lessonId);
    let resourceIndex = lesson.resources.findIndex(reso => reso._id.toString() === req.params.id);

    if (req.body.name)
        lesson.resources[resourceIndex].name = req.body.name;

    if (req.body.content)
        lesson.resources[resourceIndex].content = req.body.content;

    lesson.resources = lesson.resources.map(reso => {
        if (reso.content.startsWith("http"))
            reso.content = reso.content.split("/").pop();
        return reso;
    })

    await lesson.save();

    res.status(200).json({
        status: "success",
        data: {
            resource: lesson.resources[resourceIndex],
        }
    });
});

const deleteResource = asyncErrorHandler(async function (req, res) {
    await Lesson.findByIdAndUpdate(req.params.lessonId,
        {
            $pull: { resources: { _id: req.params.id } }
        },
        {
            runValidators: true,
        });

    res.status(204).send();
});

module.exports = {
    getAllResource,
    createResource,
    getResource,
    updateResource,
    deleteResource,
    uploadContentFile,
    handleContentFile
}