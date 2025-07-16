const mongoose = require('mongoose');
const resourceSchema = require('./Resource');
const cloudinary = require("../config/cloudinary");
const { extractPublicId } = require("../utils/extractPublicId");

const lessonSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        video: {
            type: String,
            required: true,
            trim: true
        },
        duration: {
            type: Number,
            required: true,
            min: 0
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true
        },
        resources: [resourceSchema]
    },
    { timestamps: true }
);

lessonSchema.post(/delete/i, async function name(doc, next) {

    if (doc.video) {
        if (doc.video.includes("cloudinary")) {
            const publicKey = extractPublicId(doc.video);
            try {
                await cloudinary.uploader.destroy(publicKey, { resource_type: 'video' });
            } catch (error) {
                console.log(error);

            }
        }
    }

    if (doc.resources.length !== 0) {
        const promises = doc.resources.map(resource => {
            if (resource.includes("cloudinary")) {
                const publicKey = extractPublicId(resource);
                return cloudinary.uploader.destroy(publicKey, { resource_type: 'raw' });
            }
            return Promise.resolve();
        });

        try {
            await Promise.all(promises);
        } catch (error) {
            console.log(error)
        }
    }

    next();
});

module.exports = mongoose.model('Lesson', lessonSchema);