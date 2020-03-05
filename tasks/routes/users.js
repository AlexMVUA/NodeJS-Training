import express from 'express';
import { populateTestData } from '../models/user.js';
import { storage } from '../models/user.js';
import { schemas } from '../schemas/user.js';
import { Controller } from '../controllers/user.js';
import validation from 'express-joi-validation';

const validator = validation.createValidator({ allowUnknown: false });

export const router = express.Router();

populateTestData(storage);

router.get('/user/:id', validator.params(schemas.user.get), (request, response) => Controller.user.get(request, response));

router.post('/user/', validator.body(schemas.user.update), (request, response) => Controller.user.create(request, response));

router.put('/user/:id', validator.params(schemas.user.get), validator.body(schemas.user.update), (request, response) => Controller.user.update(request, response));

router.delete('/user/:id', validator.params(schemas.user.delete), (request, response) => Controller.user.delete(request, response));

router.get('/getAutoSuggestUsers', (request, response) => Controller.user.getAutoSuggestedUsers(request, response));
