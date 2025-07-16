const express = require("express");
const { protect, allowedTo } = require('../middlewares/authMiddleware');
const {
    addUserIdToReqBody,
    addLessonIdToReqBody,
    checkCommentBelongToUser,
    checkCourseBelongToTeacher,
    addLessonIdToReqQuery
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

router.route("/")
    .get(
        addLessonIdToReqQuery,
        getAllComments
    )
    .post(
        protect,
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
        protect,
        allowedTo("user"),
        addUserIdToReqBody,
        addLessonIdToReqBody,
        checkCommentBelongToUser,
        updateCommentValidator,
        updateComment
    )
    .delete(
        protect,
        allowedTo("user", "teacher"),
        addLessonIdToReqBody,
        checkCommentBelongToUser,
        checkCourseBelongToTeacher,
        deleteCommentValidator,
        deleteComment
    );

module.exports = router;