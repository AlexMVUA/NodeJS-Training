import config from 'dotenv/config.js'; // eslint-disable-line no-unused-vars
import cors from 'cors';
import express from 'express';
import HttpStatus from 'http-status-codes';
import * as userRouter from './routes/users.js';
import { userGroupRouter } from './routes/userGroups.js';
import { logger, errorLogger } from './utils/logger.js';
import { Constants } from './utils/constants.js';

const app = express();
app.listen(process.env.ENV_PORT);
app.use(express.json());

app.use(cors(Constants.Configuration.CORS_OPTIONS));

app.use(logger);
app.use('/users/', userRouter.router);
app.use('/userGroups/', userGroupRouter);
app.use(errorLogger);

app.use((err, req, res) =>
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(`${err} has occurred!`)
);

process.on('uncaughtException', (err) => {
    console.error(`${new Date().toUTCString()} | uncaughtException:${err.message}`);
    process.exit(1);
}).on('unhandledRejection', error => {
    console.error(`unhandledRejection: ${error.message}`);
});
