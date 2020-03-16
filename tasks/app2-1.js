import express from 'express';
import * as userRouter from './routes/users.js';
import { logger, errorLogger } from './utils/logger.js';
import cors from 'cors';

const app = express();
app.listen(3000);
app.use(express.json());

const corsOptions = { origin: false };
app.use(cors(corsOptions));

app.use(logger);
app.use('/users/', userRouter.router);
app.use(errorLogger);

app.use((err, req, res, next) => // eslint-disable-line no-unused-vars
    res.status(500).send(`${err} has occurred!`)
);

process.on('uncaughtException', (err, req, res, next) => { // eslint-disable-line no-unused-vars
    console.error(`${new Date().toUTCString()} | uncaughtException:${err.message}`);
    process.exit(1);
}).on('unhandledRejection', error => {
    console.error(`unhandledRejection: ${error.message}`);
});
