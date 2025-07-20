const fs = require("fs");

const removeLocalFiles = async (req) => {
    if (req.upload === "course") {
        fs.unlinkSync(req.filePath);
    }

    if (req.upload === "lesson") {
        if (req.filePath) {
            fs.unlinkSync(req.filePath);
        }
    }

    if (req.upload === "new") {
        if (req.filePath) {
            fs.unlinkSync(req.filePath);
        }
    }

    if (req.upload === "resource") {
        if (req.filePath) {
            fs.unlinkSync(req.filePath);
        }
    }

    if (req.upload === "user") {
        if (req.coverImageFilePath) {
            fs.unlinkSync(req.coverImageFilePath);
        }

        if (req.cvFilePath) {
            fs.unlinkSync(req.cvFilePath);
        }
    }
}

module.exports = removeLocalFiles;