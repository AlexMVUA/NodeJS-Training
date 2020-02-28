const express = require('express');
const uuid = require('uuid');

const router = express.Router();

const userStorage = new Map();

function User(login, password, age, uid = uuid.v4()) {
    this.id = uid;
    this.login = login;
    this.password = password;
    this.age = age;
    this.isDeleted = false;
}

const defaultUser = new User('default', 'password', 25, '1');
const secondUser = new User('secondUser', 'password', 14, '2');
const thirdUser = new User('thirdUser', 'password', 38, '3');
userStorage.set(defaultUser.id, defaultUser);
userStorage.set(secondUser.id, secondUser);
userStorage.set(thirdUser.id, thirdUser);

function isUserExist(request) {
    return userStorage.has(request.params.id);
}

router.get('/user/:id', (request, response) => {
    if (isUserExist(request)) {
        response.status(200).send(userStorage.get(request.params.id));
    } else {
        response.status(404).send({ message: 'User not found' });
    }
});

router.post('/user/', (request, response) => {
    const user = request.body;
    const createdUser = new User(user.login, user.password, user.age);
    userStorage.set(createdUser.id, createdUser);
    response.status(201).send({ id: createdUser.id });
});

router.put('/user/', (request, response) => {
    const { age, id, login, password } = request.body;
    let updatedUser;
    if (isUserExist(request)) {
        updatedUser = new User(login, password, age, id);
        userStorage.set(updatedUser.id, updatedUser);
        response.status(200).send({ id: updatedUser.id });
    } else {
        response.status(404).send({ id: 'user not found' });
    }
});

router.delete('/user/:id', (request, response) => {
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
