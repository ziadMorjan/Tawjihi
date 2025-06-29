const express = require("express");
const { protect, allowedTo } = require('../middlewares/authMiddleware');
const {
    addUserIdToReqBody,
    addLessonIdToReqBody,
    checkCommentBelongToUser,
    checkCourseBelongToTeacher
} = require("../middlewares/commentMiddleware");
const {
    createCommentValidator,
    getCommentValidator,
    updateCommentValidator,
    deleteCommentValidator
} = require("../utils/validators/commentValidator");
const {
    getAllComments,
    createComment,
    getComment,
    updateComment,
    deleteComment
} = require("../controllers/CommentController");

const router = express.Router({ mergeParams: true });

router.use(protect)

router.route("/")
    .get(getAllComments)
    .post(
        allowedTo("user"),
        addUserIdToReqBody,
        addLessonIdToReqBody,
        createCommentValidator,
        createComment
    );

router.route("/:id")
    .get(
        getCommentValidator,
        getComment
    )
    .patch(
        allowedTo("user"),
        addUserIdToReqBody,
        addLessonIdToReqBody,
        checkCommentBelongToUser,
        updateCommentValidator,
        updateComment
    )
    .delete(
        allowedTo("user", "teacher"),
        addLessonIdToReqBody,
        checkCommentBelongToUser,
        checkCourseBelongToTeacher,
        deleteCommentValidator,
        deleteComment
    );

module.exports = router;