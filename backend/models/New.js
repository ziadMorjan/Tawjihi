const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");
const { extractPublicId } = require("../utils/extractPublicId");


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


newSchema.post(/delete/i, async function name(doc, next) {

    if (doc.coverImage) {
        if (doc.coverImage.includes("cloudinary")) {
            const publicKey = extractPublicId(doc.coverImage);
            try {
                await cloudinary.uploader.destroy(publicKey, { resource_type: "image" });
            } catch (error) {
                console.log(error);

            }
        }
    }

    next();
});


module.exports = mongoose.model("New", newSchema);