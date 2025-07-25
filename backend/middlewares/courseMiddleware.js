import Course from '../models/Course.js';
import CustomError from '../utils/CustomError.js';
import { asyncErrorHandler } from './errorMiddleware.js';


export const checkCourseBelongToTeacher = asyncErrorHandler(async function (req, res, next) {
    if (req.user.role === "teacher") {
        let course = await Course.findById(req.params.id)
        if (req.user.id !== course.teacher.id)
            throw new CustomError("This course does not belong to you", 403);
    }
    next();
});
