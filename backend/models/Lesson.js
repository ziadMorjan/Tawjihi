const mongoose = require('mongoose');

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
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true
        }
    },
    { timestamps: true }
);


const setFileUrlInRes = doc => {
    if (doc.video)
        doc.video = `${process.env.BASE_URL}/lessons/videos/${doc.video}`;
}

lessonSchema.post("save", doc => setFileUrlInRes(doc));

lessonSchema.post("init", doc => setFileUrlInRes(doc));


module.exports = mongoose.model('Lesson', lessonSchema);