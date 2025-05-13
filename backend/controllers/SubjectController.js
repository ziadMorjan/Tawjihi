const Subject = require("../models/Subject");
const {
    getAll,
    createOne,
    getOne,
    updateOne,
    deleteOne,
} = require("./controller");

const getAllSubjects = getAll(Subject);

const createSubject = createOne(Subject);

const getSubject = getOne(Subject, "Subject");

const updateSubject = updateOne(Subject, "Subject");

const deleteSubject = deleteOne(Subject, "Subject");

module.exports = {
    getAllSubjects,
    createSubject,
    getSubject,
    updateSubject,
    deleteSubject,
};