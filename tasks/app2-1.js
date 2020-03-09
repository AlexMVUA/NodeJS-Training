import express from 'express';
import * as userRouter from './routes/users.js';
import { logger, errorLogger } from './utils/logger.js';

const app = express();
app.listen(3000);
app.use(express.json());
app.use(logger);

app.use('/users/', userRouter.router);

app.use(errorLogger);
