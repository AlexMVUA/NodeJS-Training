import winston from 'winston';
import expressWinston from 'express-winston';

export const logger = expressWinston.logger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.json(),
    meta: false,
    msg: 'HTTP {{req.method}} {{req.url}} {{res.responseTime}}ms',
    expressFormat: false,
    colorize: false
});

export const errorLogger = expressWinston.errorLogger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
});
