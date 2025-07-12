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

module.exports = resourceSchema;