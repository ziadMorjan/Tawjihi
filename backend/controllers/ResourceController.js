import { Readable } from 'stream';
import Lesson from '../models/Lesson.js';
import CustomError from '../utils/CustomError.js';
import { asyncErrorHandler } from '../middlewares/errorMiddleware.js';
import { uploadSingleField } from '../middlewares/uploadsMiddleware.js';
import cloudinary from '../config/cloudinary.js';

export const uploadContentFile = uploadSingleField('content');

const uploadToCloudinary = (buffer, options) =>
	new Promise((resolve, reject) => {
		const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
			if (error) reject(error);
			else resolve(result);
		});
		// eslint-disable-next-line node/no-unsupported-features/node-builtins
		Readable.from(buffer).pipe(stream);
	});

const allowedMimes = [
	'application/pdf',
	'application/msword',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/zip',
	'application/x-zip-compressed',
	'application/vnd.rar',
	'application/vnd.ms-powerpoint',
	'application/vnd.openxmlformats-officedocument.presentationml.presentation',
];

export const handleContentFile = asyncErrorHandler(async (req, res, next) => {
	if (req.file) {
		const { mimetype, buffer, originalname } = req.file;
		
		if (!allowedMimes.includes(mimetype)) {
			throw new CustomError('نوع الملف غير مدعوم. يرجى رفع ملفات PDF, Word, PPT أو Zip', 400);
		}

		const result = await uploadToCloudinary(buffer, {
			resource_type: 'raw',
			folder: 'tawjihi/lessons/resources',
			public_id: `${Date.now()}-${originalname.replace(/\s+/g, '_')}`,
		});

		req.body.content = result.secure_url;
	}
	next();
});

export const getAllResource = asyncErrorHandler(async (req, res) => {
	const lesson = await Lesson.findById(req.params.lessonId);

	res.status(200).json({
		status: 'success',
		count: lesson.resources.length,
		data: {
			resources: lesson.resources,
		},
	});
});

export const createResource = asyncErrorHandler(async (req, res) => {
	const lesson = await Lesson.findByIdAndUpdate(
		req.params.lessonId,
		{
			$push: { resources: req.body },
		},
		{
			new: true,
			runValidators: true,
		},
	);

	res.status(201).json({
		status: 'success',
		count: lesson.resources.length,
		data: {
			resources: lesson.resources,
		},
	});
});

export const getResource = asyncErrorHandler(async (req, res) => {
	const lesson = await Lesson.findById(req.params.lessonId);

	const [resource] = lesson.resources.filter(
		(resource) => resource._id.toString() === req.params.id,
	);

	res.status(200).json({
		status: 'success',
		data: {
			resource,
		},
	});
});

export const updateResource = asyncErrorHandler(async (req, res) => {
	const lesson = await Lesson.findById(req.params.lessonId);
	const resourceIndex = lesson.resources.findIndex(
		(resource) => resource._id.toString() === req.params.id,
	);

	if (req.body.name) lesson.resources[resourceIndex].name = req.body.name;
	if (req.body.content) lesson.resources[resourceIndex].content = req.body.content;

	await lesson.save();

	res.status(200).json({
		status: 'success',
		data: {
			resource: lesson.resources[resourceIndex],
		},
	});
});

export const deleteResource = asyncErrorHandler(async (req, res) => {
	await Lesson.findByIdAndUpdate(
		req.params.lessonId,
		{
			$pull: { resources: { _id: req.params.id } },
		},
		{
			runValidators: true,
		},
	);

	res.status(204).send();
});
