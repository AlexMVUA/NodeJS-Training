import express from 'express';
import { initUserGroups } from '../models/userGroup.js';
import { Controller } from '../controllers/user.js';

const userGroupRouter = express.Router();

initUserGroups();

userGroupRouter.get('/group/:id', (request, response) => Controller.userGroup.get(request, response));

userGroupRouter.get('/', (request, response) => Controller.userGroup.getAll(request, response));

export { userGroupRouter };
