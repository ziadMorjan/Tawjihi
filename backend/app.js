const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const passport = require("passport");

const branchRoutes = require('./routes/BranchRouts');
const subjectRoutes = require('./routes/SubjectRoutes');
const userRoutes = require('./routes/UserRoutes');
const courseRoutes = require('./routes/CourseRoutes');
const authRoutes = require('./routes/AuthRouts');
const lessonRouts = require('./routes/LessonRouts');
const enrollmentRouts = require('./routes/EnrollmentRouts');
const newsRouts = require('./routes/NewsRouts');
const defaultRoutes = require('./routes/DefaultRoute');

const { googleStrategy, facebookStrategy } = require("./config/passport");

const { globalErrorHandler } = require('./middlewares/errorMiddleware');

let app = express();

passport.use(googleStrategy);
passport.use(facebookStrategy);

// Middleware
app.use(express.json());
app.use(express.static('uploads'));
app.use(morgan('dev'));
app.use(cors());
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
app.use(defaultRoutes);

// global error handler
app.use(globalErrorHandler)

module.exports = app;