import HttpStatus from 'http-status-codes';
import { Controller } from '../../src/controllers/user';
import { Permission } from "../../src/models/permission";
import { initUserGroups, UserGroup } from '../../src/models/userGroup';
import { Constants } from "../../src/utils/constants";

const mockRequest = (sessionData) => {
    return {
        session: { data: sessionData },
        params: {
            id: sessionData.id
        }
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
            const expectedResponse = JSON.stringify([expectedUserGroupAdmin,expectedEmployeeGroup]);

            const res = mockResponse();

            Controller.userGroup.getAll(req, res);
            expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
            const actualResponse = res.send.mock.calls[0][0];
            expect(actualResponse).toStrictEqual(expectedResponse);
        });

    });
});
