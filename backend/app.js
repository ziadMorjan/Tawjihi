const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const passport = require("passport");
const cookieParser = require('cookie-parser');

const { googleStrategy, facebookStrategy } = require("./config/passport");
const routes = require("./routes");
const { webhook } = require("./controllers/PaymentController");
const { globalErrorHandler } = require('./middlewares/errorMiddleware');

const app = express();

passport.use(googleStrategy);
passport.use(facebookStrategy);

app.use(morgan('dev'));
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.post('/api/v1/webhook', express.raw({ type: "application/json" }), webhook);

app.use(cookieParser());
app.use(express.json());
app.use(express.static('uploads'));
app.use(passport.initialize());

// Mount routes
routes(app);

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
