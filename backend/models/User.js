const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "name is required"],
        },
        slug: {
            type: String,
            lowercase: true,
        },
        email: {
            type: String,
            required: [true, "email is required"],
            unique: [true, "email must be unique"],
            lowercase: true,
        },
        password: {
            type: String,
            minlength: 8,
            required: [true, "password is required"],
        },
        phone: String,
        coverImage: String,
        role: {
            type: String,
            enum: ["admin", "teacher", "user"],
            default: "user"
        },
        resetPasswordCode: String,
        resetPasswordCodeExpired: Date,
        PasswordChangedAt: Date,
        isActive: {
            type: Boolean,
            default: true,
        }

    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', UserSchema);