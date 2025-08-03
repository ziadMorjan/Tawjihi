import slugify from 'slugify';
import QueryManipulator from '../utils/QueryManipulator.js';
import CustomError from '../utils/CustomError.js';
import { asyncErrorHandler } from '../middlewares/errorMiddleware.js';

export const getAll = (model) =>
	asyncErrorHandler(async (req, res) => {
		const qm = new QueryManipulator(req, model)
			.filter()
			.selectFields()
			.search()
			.sort()
			.paginate();

		const docs = await qm.query;

		res.status(200).json({
			status: 'success',
			count: docs.length,
			data: {
				docs,
			},
		});
	});

export const createOne = (model) =>
	asyncErrorHandler(async (req, res) => {
		if (req.body.name) req.body.slug = slugify(req.body.name);

		const newDoc = await model.create(req.body);

		res.status(201).json({
			status: 'success',
			data: {
				newDoc,
			},
		});
	});

export const getOne = (model, modelName = 'Document') =>
	asyncErrorHandler(async (req, res) => {
		const doc = await model.findById(req.params.id);

		if (!doc) {
			const translatedModelName = req.__(`models.${modelName}`);
			throw new CustomError(
				req.__('generic.not_found', { model_name: translatedModelName }),
				404,
			);
		}

		res.status(200).json({
			status: 'success',
			data: {
				doc,
			},
		});
	});

export const updateOne = (model, modelName = 'Document') =>
	asyncErrorHandler(async (req, res) => {
		if (req.body.name) req.body.slug = slugify(req.body.name);

		const updatedDoc = await model.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!updatedDoc) {
			const translatedModelName = req.__(`models.${modelName}`);
			throw new CustomError(
				req.__('generic.not_found', { model_name: translatedModelName }),
				404,
			);
		}

		res.status(200).json({
			status: 'success',
			data: {
				updatedDoc,
			},
		});
	});

export const deleteOne = (model, modelName = 'Document') =>
	asyncErrorHandler(async (req, res) => {
		const deletedDoc = await model.findByIdAndDelete(req.params.id);

		if (!deletedDoc) {
			const translatedModelName = req.__(`models.${modelName}`);
			throw new CustomError(
				req.__('generic.not_found', { model_name: translatedModelName }),
				404,
			);
		}

		res.status(204).send();
	});
