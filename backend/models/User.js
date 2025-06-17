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
        description: {
            type: String,
            minlength: 10,
            maxlength: 1000,
        },
        googleId: String,
        facebookId: String,
        password: {
            type: String,
            minlength: 8,
            select: false
        },
        phone: {
            type: String,
        },
        coverImage: String,
        cv: String,
        role: {
            type: String,
            enum: ["admin", "teacher", "user"],
            default: "user"
        },
        wishlist: [{
            type: mongoose.Types.ObjectId,
            ref: "Course"
        }],
        resetPasswordCode: String,
        resetPasswordCodeExpired: Date,
        resetPasswordCodeVerified: Boolean,
        PasswordChangedAt: Date,
        isActive: {
            type: Boolean,
            default: true,
        },
        reviewsQuantity: Number,
        averageRating: {
            type: Number,
            min: 0,
            max: 5
        },
    },
    {
        timestamps: true,
    }
);

UserSchema.pre(/^find/, function name(next) {
    this.populate({
        path: "wishlist"
    });
    next();
});

UserSchema.pre("save", function (next) {
    if (!this.isModified("password")) next();
    this.password = bcryptjs.hashSync(this.password, 10);
    next();
})

const setFileUrlInRes = doc => {
    if (doc.coverImage)
        if (!doc.coverImage.startsWith("http"))
            doc.coverImage = `${process.env.BASE_URL}/images/users/${doc.coverImage}`;
    if (doc.cv)
        if (!doc.cv.startsWith("http"))
            doc.cv = `${process.env.BASE_URL}/cvs/${doc.cv}`;
}

UserSchema.post("save", doc => setFileUrlInRes(doc));

UserSchema.post("init", doc => setFileUrlInRes(doc));

module.exports = mongoose.model('User', UserSchema);