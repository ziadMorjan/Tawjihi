const branchRoutes = require('./BranchRouts');
const subjectRoutes = require('./SubjectRoutes');
const userRoutes = require('./UserRoutes');
const courseRoutes = require('./CourseRoutes');
const authRoutes = require('./AuthRouts');
const lessonRouts = require('./LessonRouts');
const enrollmentRouts = require('./EnrollmentRouts');
const newsRouts = require('./NewsRouts');
const wishlistRouts = require('./wishlistRoute');
const ReviewRoutes = require('./ReviewRoutes');
const couponRouts = require('./CouponRouts');
const cartRouts = require('./CartRouts');
const TeacherReviewRoutes = require('./TeacherReviewRoutes');
const PaymentRoutes = require('./PaymentRoutes');
const CommentRoutes = require('./CommentRoutes');
const defaultRoutes = require('./DefaultRoute');


const routes = app => {
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
}

module.exports = routes;