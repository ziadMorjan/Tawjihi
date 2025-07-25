import slugify from 'slugify';
import QueryManipulator from '../utils/QueryManipulator.js';
import CustomError from '../utils/CustomError.js';
import { asyncErrorHandler } from '../middlewares/errorMiddleware.js';

export const getAll = (model) => asyncErrorHandler(async function (req, res) {
    let qm = new QueryManipulator(req, model)
        .filter()
        .selectFields()
        .search()
        .sort()
        .paginate();

    let docs = await qm.query;

    res.status(200).json({
        status: "success",
        count: docs.length,
        data: {
            docs
        },
    });
});

export const createOne = (model) => asyncErrorHandler(async function (req, res) {
    if (req.body.name)
        req.body.slug = slugify(req.body.name);

    let newDoc = await model.create(req.body);

    res.status(201).json({
        status: "success",
        data: {
            newDoc
        },
    });
});

export const getOne = (model, modelName = "") => asyncErrorHandler(async function (req, res) {
    let doc = await model.findById(req.params.id);

    if (!doc) {
        throw new CustomError(`${modelName} not found`, 404);
    }

    res.status(200).json({
        status: "success",
        data: {
            doc,
        },
    });
});

export const updateOne = (model, modelName = "") => asyncErrorHandler(async function (req, res) {
    if (req.body.name)
        req.body.slug = slugify(req.body.name);

    let updatedDoc = await model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!updatedDoc) {
        throw new CustomError(`${modelName} not found`, 404);
    }

    res.status(200).json({
        status: "success",
        data: {
            updatedDoc,
        },
    });
});

export const deleteOne = (model, modelName = "") => asyncErrorHandler(async function (req, res) {
    let deletedDoc = await model.findByIdAndDelete(req.params.id);

    if (!deletedDoc) {
        throw new CustomError(`${modelName} not found`, 404);
    }

    res.status(204).send();
});
