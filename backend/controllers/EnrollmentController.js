const Enrollment = require('../models/Enrollment');
const {
    getAll,
    createOne,
    getOne,
    updateOne,
    deleteOne
} = require("./controller");

const getAllEnrollments = getAll(Enrollment);

const createEnrollment = createOne(Enrollment);

const getEnrollment = getOne(Enrollment, "enrollment");

const updateEnrollment = updateOne(Enrollment, "enrollment");

const deleteEnrollment = deleteOne(Enrollment, "enrollment");


module.exports = {
    getAllEnrollments,
    createEnrollment,
    getEnrollment,
    updateEnrollment,
    deleteEnrollment
}