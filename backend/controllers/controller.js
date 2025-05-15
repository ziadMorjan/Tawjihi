const { default: slugify } = require("slugify");
const { asyncErrorHandler } = require("../middlewares/errorMiddleware");
const CustomError = require("../utils/CustomError");

const getAll = (model) => asyncErrorHandler(async function (req, res) {
    let docs = await model.find();

    res.status(200).json({
        status: "success",
        count: docs.length,
        data: {
            docs
        },
    });
});

const createOne = (model) => asyncErrorHandler(async function (req, res) {
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

const getOne = (model, modelName = "") => asyncErrorHandler(async function (req, res) {
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

let updateOne = (model, modelName = "") => asyncErrorHandler(async function (req, res) {
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

let deleteOne = (model, modelName = "") => asyncErrorHandler(async function (req, res) {
    let deletedDoc = await model.findByIdAndDelete(req.params.id);

    if (!deletedDoc) {
        throw new CustomError(`${modelName} not found`, 404);
    }

    res.status(204).send();
});

module.exports = {
    getAll,
    createOne,
    getOne,
    updateOne,
    deleteOne
};