const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const passport = require("passport");
const cookieParser = require('cookie-parser');

const branchRoutes = require('./routes/BranchRouts');
const subjectRoutes = require('./routes/SubjectRoutes');
const userRoutes = require('./routes/UserRoutes');
const courseRoutes = require('./routes/CourseRoutes');
const authRoutes = require('./routes/AuthRouts');
const lessonRouts = require('./routes/LessonRouts');
const enrollmentRouts = require('./routes/EnrollmentRouts');
const newsRouts = require('./routes/NewsRouts');
const wishlistRouts = require('./routes/wishlistRoute');
const ReviewRoutes = require('./routes/ReviewRoutes');
const couponRouts = require('./routes/CouponRouts');
const cartRouts = require('./routes/CartRouts');
const TeacherReviewRoutes = require('./routes/TeacherReviewRoutes');
const stripeRoutes = require('./routes/StripeRoutes');
const defaultRoutes = require('./routes/DefaultRoute');

const { googleStrategy, facebookStrategy } = require("./config/passport");

const { globalErrorHandler } = require('./middlewares/errorMiddleware');

const app = express();

passport.use(googleStrategy);
passport.use(facebookStrategy);

// Middleware
app.use(morgan('dev'));
app.use(cors({
    origin: 'http://localhost:3000', // your local frontend URL
    credentials: true               // allow sending cookies cross-origin
}));

app.use('/api/v1/payment/webhook', require('./routes/webhook'));
app.use(cookieParser());
app.use(express.json());
app.use(express.static('uploads'));
app.use(passport.initialize());

// Mount routes
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
app.use('/api/v1/payment', stripeRoutes);
app.use(defaultRoutes);

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
