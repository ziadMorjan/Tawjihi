const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Types.ObjectId,
            ref: "Course",
            required: true
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

enrollmentSchema.pre(/^find/, function (next) {
    this.populate({
        path: "course",
        select: "name"
    });

    this.populate({
        path: "user",
        select: "name"
    });

    next();
});

module.exports = mongoose.model("Enrollment", enrollmentSchema);