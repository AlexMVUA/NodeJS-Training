import express from 'express';
import * as userRouter from './routes/users.js';

const app = express();

app.listen(3000);
app.use(express.json());

app.use('/users/', userRouter.router);
