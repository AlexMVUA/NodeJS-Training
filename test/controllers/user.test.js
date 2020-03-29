import HttpStatus from 'http-status-codes';
import { Controller } from '../../src/controllers/user';
import { Permission } from "../../src/models/permission";
import { populateTestData, User, storage } from "../../src/models/user";
import { initUserGroups, UserGroup } from '../../src/models/userGroup';
import { Constants } from "../../src/utils/constants";
import { Authentication } from '../../src/utils/auth.js';

jest.mock('../../src/utils/auth.js');

const mockRequest = (sessionData, body, query) => {
    return {
        session: { data: sessionData },
        params: {
            id: sessionData.id
        },
        body: body,
        query: query
    };
};

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
describe('Testing Controller within User Group Entity', () => {
    describe('Testing getting user group by ID:', () => {
        beforeEach(() => {
            initUserGroups();
        });

        test('should 200 with user group when user group is present', () => {
            const req = mockRequest({ id: 'admin' });
            const expectedUserGroup = new UserGroup('admin', 'adminGroup', [Permission.READ, Permission.WRITE, Permission.DELETE, Permission.SHARE, Permission.UPLOAD_FILES]);
            const res = mockResponse();

            Controller.userGroup.get(req, res);

            expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
            expect(res.send.mock.calls[0][0]).toStrictEqual(expectedUserGroup);
        });

        test('should 404 with error message when user group is absent', () => {
            const req = mockRequest({ id: 'absent' });
            const res = mockResponse();

            Controller.userGroup.get(req, res);

            expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
            expect(res.send).toHaveBeenCalledWith({ message: Constants.ErrorMessages.USER_GROUP_NOT_FOUND });
        });
    });
    describe('Testing getting ALL user groups', () => {
        test('should 200 with all user groups', () => {
            const req = mockRequest({ id: 'admin' });
            const expectedUserGroupAdmin = new UserGroup('admin', 'adminGroup', [Permission.READ, Permission.WRITE, Permission.DELETE, Permission.SHARE, Permission.UPLOAD_FILES]);
            const expectedEmployeeGroup = new UserGroup('employee', 'employeeGroup', [Permission.READ, Permission.WRITE]);
            const expectedResponse = JSON.stringify([expectedUserGroupAdmin, expectedEmployeeGroup]);

            const res = mockResponse();

            Controller.userGroup.getAll(req, res);
            expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
            const actualResponse = res.send.mock.calls[0][0];
            expect(actualResponse).toStrictEqual(expectedResponse);
        });

    });
});

describe('Testing Controller within User Entity', () => {
    describe('Testing getting user by ID:', () => {
        beforeEach(() => {
            populateTestData(storage);
        });

        test('should send 200 response with user when user is present', () => {
            const req = mockRequest({ id: '11' });
            const expectedUser = new User('default', 'password', 25, '11');
            const res = mockResponse();

            Controller.user.get(req, res);

            expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
            expect(res.send.mock.calls[0][0]).toStrictEqual(expectedUser);
        });

        test('should send 404 response with user when user is absent', () => {
            const req = mockRequest({ id: '000' });
            const res = mockResponse();

            Controller.user.get(req, res);

            expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
            expect(res.send.mock.calls[0][0]).toStrictEqual({ message: Constants.ErrorMessages.USER_NOT_FOUND });
        });

        test('should throw error with predefined criteria met, id is bigger 777', () => {
            const req = mockRequest({ id: '7777' });
            const res = mockResponse();

            function throwError() {
                Controller.user.get(req, res);
            }

            expect(throwError).toThrowError(Constants.ErrorMessages.UNEXPECTED_ERROR);
        });
    });


    describe('Testing create user', () => {
        beforeEach(() => {
            populateTestData(storage);
        });

        test('should send 201 response with created user\'s id', () => {
            const newUser = {
                'login': 'postuser',
                'password': 'password1',
                'id': '111-222',
                'age': 19
            };
            const req = mockRequest({}, newUser);
            const createdUser = new User('postuser', 'password1', 19, '111-222');
            const res = mockResponse();

            Controller.user.create(req, res);

            expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
            expect(res.send.mock.calls[0][0]).toStrictEqual({ id: createdUser.id });
        });

        test('should persist created user', () => {
            const newUser = {
                'login': 'postuser',
                'password': 'password1',
                'id': '111-222',
                'age': 19
            };
            const req = mockRequest({}, newUser);
            const createdUser = new User('postuser', 'password1', 19, '111-222');
            const res = mockResponse();

            Controller.user.create(req, res);
            expect(storage.get(createdUser.id)).toStrictEqual(createdUser);
        });
    });

    describe('Testing update user', () => {
        beforeEach(() => {
            populateTestData(storage);
        });

        test('should send 200 response with updated user\'s id', () => {
            const updatedUser = {
                'login': 'default_updated',
                'password': 'password_updated',
                'age': 20
            };
            const updatedDefaultUser = new User('default_updated', 'password_updated', 20, '11', Constants.Configuration.Group.DEFAULT_ID);
            const req = mockRequest({ 'id': '11' }, updatedUser);
            const res = mockResponse();

            Controller.user.update(req, res);

            expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
            expect(res.send.mock.calls[0][0]).toStrictEqual({ id: '11' });
            expect(storage.get('11')).toStrictEqual(updatedDefaultUser);
        });

        test('should send 404 response with user when user is absent', () => {
            const req = mockRequest({ id: '000' }, {});
            const res = mockResponse();

            Controller.user.update(req, res);

            expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
            expect(res.send.mock.calls[0][0]).toStrictEqual({ id: Constants.ErrorMessages.USER_NOT_FOUND });
        });
    });

    describe('Testing delete user', () => {
        beforeEach(() => {
            populateTestData(storage);
        });

        test('should send 200 response with success message and mark user as deleted', () => {
            const deletedDefaultUser = new User('default', 'password', 25, '11', Constants.Configuration.Group.DEFAULT_ID);
            deletedDefaultUser.isDeleted = true;
            const req = mockRequest({ 'id': '11' });
            const res = mockResponse();

            Controller.user.delete(req, res);

            expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
            expect(res.send.mock.calls[0][0]).toStrictEqual({ result: Constants.Configuration.REMOVED_OK });
            expect(storage.get('11')).toStrictEqual(deletedDefaultUser);
        });

        test('should send 204 response with error message when user absent by id', () => {
            const req = mockRequest({ id: '000' }, {});
            const res = mockResponse();

            Controller.user.delete(req, res);

            expect(res.status).toHaveBeenCalledWith(HttpStatus.NO_CONTENT);
            expect(res.send.mock.calls[0][0]).toStrictEqual({ id: Constants.ErrorMessages.USER_NOT_FOUND });
        });
    });

    describe('Testing getting Auto-suggested users', () => {
        beforeEach(() => {
            populateTestData(storage);
        });

        test('should send 200 response with user found by login substring', () => {
            const secondUser = new User('secondUser', 'password', 14, '22', Constants.Configuration.Group.EMPLOYEE_ID);
            const expectedResponse = JSON.stringify([secondUser]);
            const req = mockRequest({}, {}, {
                'loginSubstring': 'second', 'limit': 5
            });
            const res = mockResponse();

            Controller.user.getAutoSuggestedUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
            expect(res.send.mock.calls[0][0]).toStrictEqual(expectedResponse);
        });

        test('should send 204 response without content when login substring is present and limit is less than zero', () => {
            const req = mockRequest({}, {}, {
                'loginSubstring': 'user', 'limit': -1
            });
            const res = mockResponse();

            Controller.user.getAutoSuggestedUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(HttpStatus.NO_CONTENT);
            expect(res.send.mock.calls[0][0]).toStrictEqual({});
        });
        test('should send 204 response without content when login substring is present and limit is zero', () => {
            const req = mockRequest({}, {}, {
                'loginSubstring': 'user', 'limit': 0
            });
            const res = mockResponse();

            Controller.user.getAutoSuggestedUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(HttpStatus.NO_CONTENT);
            expect(res.send.mock.calls[0][0]).toStrictEqual({});
        });
        test('should send 204 response without content when login substring is present and limit is NaN', () => {
            const req = mockRequest({}, {}, {
                'loginSubstring': 'user', 'limit': 'qwerty'
            });
            const res = mockResponse();

            Controller.user.getAutoSuggestedUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(HttpStatus.NO_CONTENT);
            expect(res.send.mock.calls[0][0]).toStrictEqual({});
        });
    });

    describe('Testing login', () => {
        beforeEach(() => {
            populateTestData(storage);
        });

        test('should send 403 response with error message when user is absent with provided login', () => {

            const expectedResponse = {
                success: false,
                message: Constants.ErrorMessages.BAD_CREDENTIALS
            };
            const req = mockRequest({}, { login: 'fraud_user' });
            const res = mockResponse();

            Controller.user.login(req, res);

            expect(res.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
            expect(res.send.mock.calls[0][0]).toStrictEqual(expectedResponse);
        });

        test('should send 403 response with error message when user is present with incorrect password', () => {

            const expectedResponse = {
                success: false,
                message: Constants.ErrorMessages.BAD_CREDENTIALS
            };
            const req = mockRequest({}, { login: 'default', password: 'nimda' });
            const res = mockResponse();

            Controller.user.login(req, res);

            expect(res.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
            expect(res.send.mock.calls[0][0]).toStrictEqual(expectedResponse);
        });

        test('should sign token within Authentication service when user is present with valid password', () => {
            const user = new User('secondUser', 'password', 14, '22', Constants.Configuration.Group.EMPLOYEE_ID);
            const req = mockRequest({}, { login: 'secondUser', password: 'password' });
            const res = mockResponse();

            Controller.user.login(req, res);

            expect(Authentication.signToken).toHaveBeenCalledWith(res, user);
        });
    });

    describe('Testing token verification', () => {
        test('should verify token within Authentication service when user is present with valid password', () => {
            const req = mockRequest({}, { login: 'fraud_user' });
            const res = mockResponse();
            const next = {};

            Controller.user.checkToken(req, res, next);

            expect(Authentication.verifyToken).toHaveBeenCalledWith(req, res, next);
        });
    });
});
