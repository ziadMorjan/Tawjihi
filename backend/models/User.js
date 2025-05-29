const mongoose = require('mongoose');
const bcryptjs = require("bcryptjs");

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
            select: false
        },
        phone: {
            type: String,
            required: true
        },
        coverImage: String,
        cv: String,
        role: {
            type: String,
            enum: ["admin", "teacher", "user"],
            default: "user"
        },
        resetPasswordCode: String,
        resetPasswordCodeExpired: Date,
        resetPasswordCodeVerified: Boolean,
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

UserSchema.pre("save", function (next) {
    if (!this.isModified("password")) next();
    this.password = bcryptjs.hashSync(this.password, 10);
    next();
})

const setFileUrlInRes = doc => {
    if (doc.coverImage)
        doc.coverImage = `${process.env.BASE_URL}/images/users/${doc.coverImage}`;
    if (doc.cv)
        doc.cv = `${process.env.BASE_URL}/cvs/${doc.cv}`;
}

UserSchema.post("save", doc => setFileUrlInRes(doc));

UserSchema.post("init", doc => setFileUrlInRes(doc));

module.exports = mongoose.model('User', UserSchema);