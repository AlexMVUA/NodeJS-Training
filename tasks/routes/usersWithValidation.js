const express = require('express');
const uuid = require('uuid');
const Joi = require('@hapi/joi');
const validator = require('express-joi-validation').createValidator({ allowUnknown: false });
const router = express.Router();

const userStorage = new Map();

const userGetDeleteSchema = Joi.object({
    id: Joi.string().alphanum().min(2).max(20).required()
});

const userSchema = Joi.object({
    login: Joi.string().alphanum().min(4).max(20).required(),
    password: Joi.string().pattern(new RegExp('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+){3,30}$')).required(),
    age: Joi.number().integer().min(4).max(130).required(),
    isDeleted:Joi.boolean()
});

function User(login, password, age, uid = uuid.v4()) {
    this.id = uid;
    this.login = login;
    this.password = password;
    this.age = age;
    this.isDeleted = false;
}

const defaultUser = new User('default', 'password', 25, '11');
const secondUser = new User('secondUser', 'password', 14, '22');
const thirdUser = new User('thirdUser', 'password', 38, '33');
userStorage.set(defaultUser.id, defaultUser);
userStorage.set(secondUser.id, secondUser);
userStorage.set(thirdUser.id, thirdUser);

function isUserExist(request) {
    return userStorage.has(request.params.id);
}

router.get('/user/:id', validator.params(userGetDeleteSchema), (request, response) => {
    if (isUserExist(request)) {
        response.status(200).send(userStorage.get(request.params.id));
    } else {
        response.status(404).send({ message: 'User not found' });
    }
});

router.post('/user/', validator.body(userSchema), (request, response) => {
    const user = request.body;
    const createdUser = new User(user.login, user.password, user.age);
    userStorage.set(createdUser.id, createdUser);
    response.status(201).send({ id: createdUser.id });
});

router.put('/user/:id', validator.params(userGetDeleteSchema), validator.body(userSchema), (request, response) => {
    const { age, login, password } = request.body;
    const id = request.params.id;
    if (isUserExist(request)) {
        const updatedUser = new User(login, password, age, id);
        userStorage.set(updatedUser.id, updatedUser);
        response.status(200).send({ id: updatedUser.id });
    } else {
        response.status(404).send({ id: 'user not found' });
    }
});

router.delete('/user/:id', validator.params(userGetDeleteSchema), (request, response) => {
    if (isUserExist(request)) {
        userStorage.get(request.params.id).isDeleted = true;
        response.status(200).send({ result: 'removed successful' });
    } else {
        response.status(204).send({ id: 'user not found' });
    }
});

function getFilteredUsers(loginSubstring, limit) {
    const filteredUsers = Array.from(userStorage.values())
        .filter(user => byLoginSubString(user, loginSubstring));
    return filteredUsers.splice(0, limit);
}

router.get('/getAutoSuggestUsers', (request, response) => {
    const { limit, loginSubstring } = request.query;
    if (loginSubstring && getLimit(limit) > 0) {
        response.status(200).send(JSON.stringify(getFilteredUsers(loginSubstring, limit)));
    } else {
        response.status(204).send({});
    }
});

function getLimit(limit) {
    if (isNaN(limit)) {
        return 0;
    }
    return limit;
}

function byLoginSubString(user, loginSubstring) {
    return user.login.toLowerCase().indexOf(loginSubstring.toLowerCase()) !== -1;
}

module.exports = router;
