import HttpStatus from 'http-status-codes';
import { getFilteredUsers, isUserExist, getUserByLogin, storage, User } from '../models/user.js';
import { getUserGroupById, isUserGroupExist, getAllGroups } from '../models/userGroup.js';
import { getLimit } from '../utils/util.js';
import { Authentication } from '../utils/auth.js';
import { Constants } from '../utils/constants.js';


export const Controller = {
    userGroup: {
        getAll(request, response) {
            response.status(HttpStatus.OK).send(JSON.stringify(getAllGroups()));
        },
        get(request, response) {
            if (isUserGroupExist(request.params.id)) {
                response.status(HttpStatus.OK).send(getUserGroupById(request.params.id));
            } else {
                response.status(HttpStatus.NOT_FOUND).send({ message: Constants.ErrorMessages.USER_GROUP_NOT_FOUND });
            }
        }
    },
    user: {
        get(request, response) {
            if (isUserExist(request.params.id)) {
                response.status(HttpStatus.OK).send(storage.get(request.params.id));
            } else if (request.params.id > Constants.Configuration.ERROR_FLAG) {
                throw Error(Constants.ErrorMessages.UNEXPECTED_ERROR);
            } else {
                response.status(HttpStatus.NOT_FOUND).send({ message: Constants.ErrorMessages.USER_NOT_FOUND });
            }
        },
        create(request, response) {
            const user = request.body;
            const createdUser = new User(user.login, user.password, user.age);
            storage.set(createdUser.id, createdUser);
            response.status(HttpStatus.CREATED).send({ id: createdUser.id });
        },
        update(request, response) {
            const { age, login, password } = request.body;
            const id = request.params.id;
            if (isUserExist(id)) {
                const updatedUser = new User(login, password, age, id);
                storage.set(updatedUser.id, updatedUser);
                response.status(HttpStatus.OK).send({ id: updatedUser.id });
            } else {
                response.status(HttpStatus.NOT_FOUND).send({ id: Constants.ErrorMessages.USER_NOT_FOUND });
            }
        },
        delete(request, response) {
            if (isUserExist(request.params.id)) {
                storage.get(request.params.id).isDeleted = true;
                response.status(HttpStatus.OK).send({ result: Constants.Configuration.REMOVED_OK });
            } else {
                response.status(HttpStatus.NO_CONTENT).send({ id: Constants.ErrorMessages.USER_NOT_FOUND });
            }
        },
        getAutoSuggestedUsers(request, response) {
            const { limit, loginSubstring } = request.query;
            if (loginSubstring && getLimit(limit) > 0) {
                response.status(HttpStatus.OK).send(JSON.stringify(getFilteredUsers(loginSubstring, limit)));
            } else {
                response.status(HttpStatus.NO_CONTENT).send({});
            }
        },
        login(request, response) {
            const user = getUserByLogin(request.body.login);
            if (!user || user.password !== request.body.password) {
                response.status(HttpStatus.FORBIDDEN).send({ success: false, message: Constants.ErrorMessages.BAD_CREDENTIALS });
            } else {
                Authentication.signToken(response, user);
            }
        },
        checkToken(request, response, next) {
            Authentication.verifyToken(request, response, next);
        }
    }
};
