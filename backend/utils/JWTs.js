const util = require("util")
const JWT = require("jsonwebtoken");

const createToken = id => JWT.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRED });

const verifyToken = token => util.promisify(JWT.verify)(token, process.env.JWT_SECRET);

module.exports = {
    createToken,
    verifyToken
}