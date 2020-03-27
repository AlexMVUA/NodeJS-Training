import uuid from 'uuid';
import { containStringIgnoreCase } from '../utils/util.js';
import { Constants } from '../utils/constants.js';

const storage = new Map();

function User(login, password, age, uid = uuid.v4(), userGroup) {
    this.id = uid;
    this.login = login;
    this.password = password;
    this.age = age;
    this.isDeleted = false;
    if (!userGroup) {
        this.groupId = Constants.Configuration.Group.DEFAULT_ID;
    }
}

function populateTestData(map) {
    const defaultUser = new User('default', 'password', 25, '11');
    const secondUser = new User('secondUser', 'password', 14, '22', Constants.Configuration.Group.EMPLOYEE_ID);
    const thirdUser = new User('thirdUser', 'password', 38, '33', Constants.Configuration.ADMIN_ID);
    map.set(defaultUser.id, defaultUser);
    map.set(secondUser.id, secondUser);
    map.set(thirdUser.id, thirdUser);
}

function isUserExist(id) {
    return storage.has(id);
}

function getUserByLogin(login) {
    return Array.from(storage.values()).find(user => user.login === login);
}

function getFilteredUsers(loginSubstring, limit) {
    const filteredUsers = Array.from(storage.values())
        .filter(user => containStringIgnoreCase(user.login, loginSubstring));
    return filteredUsers.splice(0, limit);
}

export { storage, User, getFilteredUsers, populateTestData, isUserExist, getUserByLogin };
