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

module.exports = mongoose.model("New", newSchema);