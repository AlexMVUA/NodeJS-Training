import { getFilteredUsers, isUserExist, getUserByLogin, storage, User } from '../models/user.js';
import { getLimit } from '../utils/util.js';
import { Authentication } from '../utils/auth.js';

const getErrorNumber = 777;

export const Controller = {
    user: {
        get(request, response) {
            if (isUserExist(request.params.id)) {
                response.status(200).send(storage.get(request.params.id));
            } else if (request.params.id > getErrorNumber) {
                throw Error('unexpected error');
            } else {
                response.status(404).send({ message: 'User not found' });
            }
        },
        create(request, response) {
            const user = request.body;
            const createdUser = new User(user.login, user.password, user.age);
            storage.set(createdUser.id, createdUser);
            response.status(201).send({ id: createdUser.id });
        },
        update(request, response) {
            const { age, login, password } = request.body;
            const id = request.params.id;
            if (isUserExist(id)) {
                const updatedUser = new User(login, password, age, id);
                storage.set(updatedUser.id, updatedUser);
                response.status(200).send({ id: updatedUser.id });
            } else {
                response.status(404).send({ id: 'user not found' });
            }
        },
        delete(request, response) {
            if (isUserExist(request.params.id)) {
                storage.get(request.params.id).isDeleted = true;
                response.status(200).send({ result: 'removed successfully' });
            } else {
                response.status(204).send({ id: 'user not found' });
            }
        },
        getAutoSuggestedUsers(request, response) {
            const { limit, loginSubstring } = request.query;
            if (loginSubstring && getLimit(limit) > 0) {
                response.status(200).send(JSON.stringify(getFilteredUsers(loginSubstring, limit)));
            } else {
                response.status(204).send({});
            }
        },
        login(request, response) {
            const user = getUserByLogin(request.body.login);
            if (user === undefined || user.password !== request.body.password) {
                response.status(403).send({ success: false, message: 'Bad credentials' });
            } else {
                Authentication.signToken(response, user);
            }
        },
        checkToken(request, response, next) {
            Authentication.verifyToken(request, response, next);
        }
    }
};
