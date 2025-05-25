const express = require("express");

const {
    protect,
    allowedTo
} = require('../middlewares/authMiddleware');

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
    .post(
        protect,
        allowedTo("admin"),
        createBranchValidator,
        createBranch,
    );

router.route("/:id")
    .get(getBranchValidator, getBranch)
    .patch(
        protect,
        allowedTo("admin"),
        updateBranchValidator,
        updateBranch,
    )
    .delete(
        protect,
        allowedTo("admin"),
        deleteBranchValidator,
        deleteBranch
    );

module.exports = router;