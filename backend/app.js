const express = require('express');
const morgan = require('morgan');

const branchRoutes = require('./routes/BranchRouts');
const subjectRoutes = require('./routes/SubjectRoutes');
const defaultRoutes = require('./routes/DefaultRoute');

const { globalErrorHandler } = require('./middlewares/errorMiddleware');

let app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Mount routes
app.use('/api/v1/branches', branchRoutes);
app.use('/api/v1/subjects', subjectRoutes);
app.use(defaultRoutes);

// global error handler
app.use(globalErrorHandler)

module.exports = app;