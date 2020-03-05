import express from 'express';
import { getLimit } from '../utils/util.js';
import { User } from '../models/user.js';
import { populateTestData } from '../models/user.js';
import { storage } from '../models/user.js';
import { isUserExist } from '../models/user.js';
import { getFilteredUsers } from '../models/user.js';
import { schemas } from '../schemas/user.js';
import validation from 'express-joi-validation';

const validator = validation.createValidator({ allowUnknown: false });

export const router = express.Router();

populateTestData(storage);

router.get('/user/:id', validator.params(schemas.user.get), (request, response) => {
    if (isUserExist(request.params.id)) {
        response.status(200).send(storage.get(request.params.id));
    } else {
        response.status(404).send({ message: 'User not found' });
    }
});

router.post('/user/', validator.body(schemas.user.update), (request, response) => {
    const user = request.body;
    const createdUser = new User(user.login, user.password, user.age);
    storage.set(createdUser.id, createdUser);
    response.status(201).send({ id: createdUser.id });
});

router.put('/user/:id', validator.params(schemas.user.get), validator.body(schemas.user.update), (request, response) => {
    const { age, login, password } = request.body;
    const id = request.params.id;
    if (isUserExist(id)) {
        const updatedUser = new User(login, password, age, id);
        storage.set(updatedUser.id, updatedUser);
        response.status(200).send({ id: updatedUser.id });
    } else {
        response.status(404).send({ id: 'user not found' });
    }
});

router.delete('/user/:id', validator.params(schemas.user.delete), (request, response) => {
    if (isUserExist(request.params.id)) {
        storage.get(request.params.id).isDeleted = true;
        response.status(200).send({ result: 'removed successfully' });
    } else {
        response.status(204).send({ id: 'user not found' });
    }
});

router.get('/getAutoSuggestUsers', (request, response) => {
    const { limit, loginSubstring } = request.query;
    if (loginSubstring && getLimit(limit) > 0) {
        response.status(200).send(JSON.stringify(getFilteredUsers(loginSubstring, limit)));
    } else {
        response.status(204).send({});
    }
});
