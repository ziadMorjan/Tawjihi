const Comment = require('../models/Comment');
const {
    getAll,
    createOne,
    getOne,
    updateOne,
    deleteOne
} = require('./controller');

const getAllComments = getAll(Comment);

const createComment = createOne(Comment);

const getComment = getOne(Comment, "Comment");

const updateComment = updateOne(Comment, "Comment");

const deleteComment = deleteOne(Comment, "Comment");

module.exports = {
    getAllComments,
    createComment,
    getComment,
    updateComment,
    deleteComment
};
