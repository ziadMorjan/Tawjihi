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

UserSchema.post("save", function (doc) {
    if (doc.coverImage)
        doc.coverImage = `${process.env.BASE_URL}/images/users/${doc.coverImage}`;
});

UserSchema.post("init", function (doc) {
    if (doc.coverImage)
        doc.coverImage = `${process.env.BASE_URL}/images/users/${doc.coverImage}`;
});

module.exports = mongoose.model('User', UserSchema);