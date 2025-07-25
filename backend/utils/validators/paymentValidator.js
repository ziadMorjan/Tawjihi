import { check } from 'express-validator';
import CustomError from '../CustomError.js';
import Course from '../../models/Course.js';
import Enrollment from '../../models/Enrollment.js';
import { validationMiddleware } from '../../middlewares/validationMiddleware.js';

export const createCheckoutSessionValidator = [
    check("ids")
        .notEmpty()
        .withMessage("Courses are required")
        .isArray()
        .custom(async (ids, { req }) => {
            const coursesPromises = ids.map(id => Course.findById(id));
            const courses = await Promise.all(coursesPromises);
            if (courses.includes(null))
                throw new CustomError("You can not pay course that not found", 400);

            const enrollmentsPromises = courses.map(course => Enrollment.findOne({ course, user: req.user.id }));
            const enrollments = await Promise.all(enrollmentsPromises);

            if (enrollments.findIndex(enrolment => enrolment !== null) !== -1)
                throw new CustomError("You can not enroll course more that one time.", 400);

            return true;
        })
    ,
    validationMiddleware
];