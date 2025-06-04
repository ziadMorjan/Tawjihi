const mongoose = require("mongoose");

const newSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        body: {
            type: String,
            required: true
        },
        coverImage: String
    },
    {
        timestamps: true
    }
);


newSchema.post("save", function (doc) {
    if (doc.coverImage)
        doc.coverImage = `${process.env.BASE_URL}/images/news/${doc.coverImage}`;
});

newSchema.post("init", function (doc) {
    if (doc.coverImage)
        doc.coverImage = `${process.env.BASE_URL}/images/news/${doc.coverImage}`;
});

module.exports = mongoose.model("New", newSchema);