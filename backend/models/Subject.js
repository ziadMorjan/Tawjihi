const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        slug: {
            type: String,
            lowercase: true,
        },
        description: {
            type: String,
            minlength: 10,
            maxlength: 1000,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Subject', subjectSchema);