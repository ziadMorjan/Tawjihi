const mongoose = require('mongoose');
const resourceSchema = require('./Resource');

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


module.exports = mongoose.model('Lesson', lessonSchema);