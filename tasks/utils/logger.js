import winston from 'winston';
import expressWinston from 'express-winston';

const loggerOptions = {
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.json(),
    meta: false,
    msg: 'HTTP {{req.method}} {{req.url}} {{res.responseTime}}ms',
    expressFormat: false,
    colorize: false
};
const logger = expressWinston.logger(loggerOptions);

const errorLoggerOptions = {
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.json(),
    meta: false,
    msg: '{{req.status || 500}} - {{err.message}} - {{req.originalUrl}} - {{req.method}}',
    expressFormat: false,
    colorize: false
};
const errorLogger = expressWinston.errorLogger(errorLoggerOptions);

export { logger, errorLogger };
