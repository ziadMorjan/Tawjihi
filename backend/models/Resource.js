const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        content: {
            type: String,
            required: true,
            trim: true
        },
    },
    { timestamps: true }
);


resourceSchema.post("save", function (doc) {
    if (doc.content)
        if (!doc.content.startsWith("http"))
            doc.content = `${process.env.BASE_URL}/lessons/resources/${doc.content}`;
});

resourceSchema.post("init", function (doc) {
    if (doc.content)
        if (!doc.content.startsWith("http"))
            doc.content = `${process.env.BASE_URL}/lessons/resources/${doc.content}`;
});


module.exports = resourceSchema;