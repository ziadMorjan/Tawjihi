import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import passport from "passport";
import cookieParser from 'cookie-parser';

import routes from "./routes/index.js";
import { webhook } from "./controllers/PaymentController.js";
import { googleStrategy, facebookStrategy } from "./config/passport.js";
import { globalErrorHandler } from './middlewares/errorMiddleware.js';

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
app.use(express.urlencoded({ extended: true }));
app.use(express.static('uploads'));
app.use(passport.initialize());

// Mount routes
routes(app);

// Global error handler
app.use(globalErrorHandler);

export default app;
