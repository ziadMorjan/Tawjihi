import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import { fileURLToPath } from 'url'; // 👈 Add this import
import New from '../models/New.js';
import { asyncErrorHandler } from '../middlewares/errorMiddleware.js';
import { uploadSingleField } from '../middlewares/uploadsMiddleware.js';
import { getAll, createOne, getOne, updateOne, deleteOne } from './controller.js';

// --- Recreate __dirname for ES Modules ---
const __filename = fileURLToPath(import.meta.url); // Gets the file path
const __dirname = path.dirname(__filename);     // Gets the directory path


export const getAllNews = getAll(New);

export const createNew = createOne(New);

export const getNew = getOne(New, "new");

export const updateNew = updateOne(New, "new");

export const deleteNew = deleteOne(New, "new");


export const uploadNewCoverImage = uploadSingleField("coverImage");

export const handleNewCoverImage = asyncErrorHandler(async function (req, res, next) {
    if (req.file) {
        let { mimetype } = req.file;
        if (!mimetype.startsWith("image"))
            throw new CustomError("invalid file type for cover image");

        let unique = crypto.randomUUID();
        let name = `new-${unique}-${Date.now()}.jpeg`;
        const uploadDir = path.join(__dirname, '..', 'uploads', 'images', 'news');
        // Ensure directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        const filePath = path.join(uploadDir, name);
        const buffer = await sharp(req.file.buffer)
            .resize(500, 500)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toBuffer();

        fs.writeFileSync(filePath, buffer);

        req.upload = "new";
        req.filePath = filePath;
    }
    next();
});
