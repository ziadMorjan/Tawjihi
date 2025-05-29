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
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true
        },
        resources: [resourceSchema]
    },
    { timestamps: true }
);


const setFileUrlInRes = doc => {
    if (doc.video)
        if (!doc.video.startsWith("http"))
            doc.video = `${process.env.BASE_URL}/lessons/videos/${doc.video}`;
    if (doc.resources) {
        doc.resources = doc.resources.map(res => {
            if (!res.content.startsWith("http"))
                res.content = `${process.env.BASE_URL}/lessons/resources/${res.content}`;
            return res;
        })
    }
}

lessonSchema.post("save", doc => setFileUrlInRes(doc));

lessonSchema.post("init", doc => setFileUrlInRes(doc));


module.exports = mongoose.model('Lesson', lessonSchema);