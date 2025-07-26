import express from 'express';
import CustomError from '../utils/CustomError.js';

const router = express.Router();

router.all('*', (req, res, next) =>
	next(new CustomError(`Can't find ${req.originalUrl} on this server`, 404)),
);

export default router;
