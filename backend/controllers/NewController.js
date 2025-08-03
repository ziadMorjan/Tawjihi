import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import New from '../models/New.js';
import CustomError from '../utils/CustomError.js';
import { asyncErrorHandler } from '../middlewares/errorMiddleware.js';
import { uploadSingleField } from '../middlewares/uploadsMiddleware.js';
import { getAll, createOne, getOne, updateOne, deleteOne } from './controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllNews = getAll(New);

export const createNew = createOne(New);

export const getNew = getOne(New, 'new');

export const updateNew = updateOne(New, 'new');

export const deleteNew = deleteOne(New, 'new');

export const uploadNewCoverImage = uploadSingleField('coverImage');

export const handleNewCoverImage = asyncErrorHandler(async (req, res, next) => {
	if (req.file) {
		const { mimetype } = req.file;
		if (!mimetype.startsWith('image'))
			throw new CustomError(req.__('generic.invalid_file_type_for_cover_image'), 400);

		const unique = crypto.randomUUID();
		const name = `new-${unique}-${Date.now()}.jpeg`;
		const uploadDir = path.join(__dirname, '..', 'uploads', 'images', 'news');

		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true });
		}
		const filePath = path.join(uploadDir, name);
		const buffer = await sharp(req.file.buffer)
			.resize(500, 500)
			.toFormat('jpeg')
			.jpeg({ quality: 90 })
			.toBuffer();

		fs.writeFileSync(filePath, buffer);

		req.upload = 'new';
		req.filePath = filePath;
	}
	next();
});
