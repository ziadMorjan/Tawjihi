const Branch = require("../models/Branch");
const {
    getAll,
    createOne,
    getOne,
    updateOne,
    deleteOne,
} = require("./controller");

const getAllBranches = getAll(Branch);

const createBranch = createOne(Branch);

const getBranch = getOne(Branch, "Branch");

const updateBranch = updateOne(Branch, "Branch");

const deleteBranch = deleteOne(Branch, "Branch");

module.exports = {
    getAllBranches,
    createBranch,
    getBranch,
    updateBranch,
    deleteBranch,
};