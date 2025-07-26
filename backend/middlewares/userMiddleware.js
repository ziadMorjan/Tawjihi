import CustomError from '../utils/CustomError.js';
import { asyncErrorHandler } from './errorMiddleware.js';

export const addUserIdToReqParams = function (req, res, next) {
	req.params.id = req.user.id;
	next();
};

// eslint-disable-next-line require-await
export const updateMeMiddleware = asyncErrorHandler(async (req, res, next) => {
	if (req.body.currentPassword || req.body.newPassword || req.body.newConfirmPassword)
		throw new CustomError('You can not change your password from here!', 403);
	if (req.body.role) throw new CustomError('You can not change your role!', 403);
	next();
});

export const activationMiddleware = (bool) =>
	function (req, res, next) {
		req.body = { isActive: bool };
		next();
	};
