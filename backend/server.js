const dotenv = require('dotenv');
const db = require("./config/db");

dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
    console.log(`UncaughtException: ${err.message}, ${err.stack}`);
    console.log('Shutting down the server due to uncaught exception');
    process.exit(1);
});

const app = require('./app');

let port = process.env.PORT || 5000;

let server = app.listen(port, () => {
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Server is running on ${process.env.BASE_URL}`);
});

db.connectDB(process.env.DB_URI);

process.on('unhandledRejection', (err) => {
    console.log(`UnhandledRejection: ${err.message}, ${err.stack}`);
    console.log('Shutting down the server due to unhandled promise rejection');
    server.close(() => {
        process.exit(1);
    });
});