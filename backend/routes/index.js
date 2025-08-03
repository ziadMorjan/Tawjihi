import branchRoutes from './BranchRouts.js';
import subjectRoutes from './SubjectRoutes.js';
import userRoutes from './UserRoutes.js';
import courseRoutes from './CourseRoutes.js';
import authRoutes from './AuthRouts.js';
import lessonRouts from './LessonRouts.js';
import enrollmentRouts from './EnrollmentRouts.js';
import newsRouts from './NewsRouts.js';
import wishlistRouts from './wishlistRoute.js';
import ReviewRoutes from './ReviewRoutes.js';
import couponRouts from './CouponRouts.js';
import cartRouts from './CartRouts.js';
import TeacherReviewRoutes from './TeacherReviewRoutes.js';
import PaymentRoutes from './PaymentRoutes.js';
import CommentRoutes from './CommentRoutes.js';
import defaultRoutes from './DefaultRoute.js';

const routes = (app) => {
	app.use('/api/v1/branches', branchRoutes);
	app.use('/api/v1/subjects', subjectRoutes);
	app.use('/api/v1/users', userRoutes);
	app.use('/api/v1/courses', courseRoutes);
	app.use('/api/v1/auth', authRoutes);
	app.use('/api/v1/lessons', lessonRouts);
	app.use('/api/v1/enrollments', enrollmentRouts);
	app.use('/api/v1/news', newsRouts);
	app.use('/api/v1/wishlist', wishlistRouts);
	app.use('/api/v1/reviews', ReviewRoutes);
	app.use('/api/v1/coupons', couponRouts);
	app.use('/api/v1/cart', cartRouts);
	app.use('/api/v1/teacherReviews', TeacherReviewRoutes);
	app.use('/api/v1/payment', PaymentRoutes);
	app.use('/api/v1/comments', CommentRoutes);
	app.use(defaultRoutes);
};

export default routes;
