import Enrollment from '../models/Enrollment.js';
import { getAll, createOne, getOne, updateOne, deleteOne } from './controller.js';

export const getAllEnrollments = getAll(Enrollment, {
	path: 'course',
	select: 'name img teacher',
	populate: {
		path: 'teacher',
		select: 'name',
	},
});
export const createEnrollment = createOne(Enrollment);

export const getEnrollment = getOne(Enrollment, 'enrollment');

export const updateEnrollment = updateOne(Enrollment, 'enrollment');

export const deleteEnrollment = deleteOne(Enrollment, 'enrollment');
