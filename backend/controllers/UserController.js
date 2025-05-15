const User = require("../models/User");
const {
    getAll,
    createOne,
    getOne,
    updateOne,
    deleteOne,
} = require("./controller");

const getAllUsers = getAll(User);

const createUser = createOne(User);

const getUser = getOne(User, "User");

const updateUser = updateOne(User, "User");

const deleteUser = deleteOne(User, "User");

module.exports = {
    getAllUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
};