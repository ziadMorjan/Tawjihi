import mongoose from 'mongoose';
import Cart from './Cart.js';

const enrollmentSchema = new mongoose.Schema(
	{
		course: {
			type: mongoose.Types.ObjectId,
			ref: 'Course',
			required: true,
		},
		user: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		completedLessons: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'Lesson',
			},
		],
	},
	{
		timestamps: true,
	},
);

// الـ Middleware المحدث والمحصن لجلب البيانات كاملة للـ Frontend
enrollmentSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'course',
		// 1. أضفنا coverImage و teacher إلى الـ select
		select: 'name coverImage teacher',
		// 2. قمنا بعمل تداخل (Nested Populate) لجلب اسم المدرس الفعلي من جدول المستخدمين
		populate: {
			path: 'teacher',
			select: 'name',
		},
	});

	this.populate({
		path: 'user',
		select: 'name',
	});

	next();
});

enrollmentSchema.post('save', async (doc, next) => {
	const cart = await Cart.findOne({ user: doc.user });
	if (cart) {
		const index = cart.courses.findIndex((course) => course.id === doc.course.toString());
		if (index !== -1) {
			cart.totalPrice -= cart.courses[index].price;
			cart.courses = cart.courses.filter((course) => course.id !== doc.course.toString());
			await cart.save();
		}
	}
	next();
});

export default mongoose.model('Enrollment', enrollmentSchema);
