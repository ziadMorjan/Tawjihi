const express = require("express");

const {
    createBranchValidator,
    updateBranchValidator,
    getBranchValidator,
    deleteBranchValidator
} = require("../utils/validators/branchValidator");

const {
    getAllBranches,
    createBranch,
    getBranch,
    updateBranch,
    deleteBranch,
} = require("../controllers/BranchController");

let router = express.Router();

router.route("/")
    .get(getAllBranches)
    .post(createBranchValidator, createBranch);

router.route("/:id")
    .get(getBranchValidator, getBranch)
    .patch(updateBranchValidator, updateBranch)
    .delete(deleteBranchValidator, deleteBranch);

module.exports = router;