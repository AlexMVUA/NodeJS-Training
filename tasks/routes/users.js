import express  from 'express';
import { getLimit } from '../utils/util.js';
import { User } from '../models/user.js';
import { populateTestData } from '../models/user.js';
import { storage } from '../models/user.js';

import { isUserExist } from '../models/user.js';
import { getFilteredUsers } from '../models/user.js';

export const router = express.Router();

populateTestData(storage);

router.get('/user/:id', (request, response) => {
    if (isUserExist(request.params.id)) {
        response.status(200).send(storage.get(request.params.id));
    } else {
        response.status(404).send({ message: 'User not found' });
    }
});

router.post('/user/', (request, response) => {
    const user = request.body;
    const createdUser = new User(user.login, user.password, user.age);
    storage.set(createdUser.id, createdUser);
    response.status(201).send({ id: createdUser.id });
});

router.put('/user/', (request, response) => {
    const { age, id, login, password } = request.body;
    let updatedUser;
    if (isUserExist(id)) {
        updatedUser = new User(login, password, age, id);
        storage.set(updatedUser.id, updatedUser);
        response.status(200).send({ id: updatedUser.id });
    } else {
        response.status(404).send({ id: 'user not found' });
    }
});

router.delete('/user/:id', (request, response) => {
    if (isUserExist(request.params.id)) {
        storage.get(request.params.id).isDeleted = true;
        response.status(200).send({ result: 'removed successful' });
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
