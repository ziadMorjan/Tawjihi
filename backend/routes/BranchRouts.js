const express = require("express");
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
    .post(createBranch);

router.route("/:id")
    .get(getBranch)
    .patch(updateBranch)
    .delete(deleteBranch);

module.exports = router;