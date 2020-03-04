import uuid from 'uuid';
import { containStringIgnoreCase } from '../utils/util.js';

export const storage = new Map();

export function User(login, password, age, uid = uuid.v4()) {
    this.id = uid;
    this.login = login;
    this.password = password;
    this.age = age;
    this.isDeleted = false;
}

export function populateTestData(map) {
    const defaultUser = new User('default', 'password', 25, '1');
    const secondUser = new User('secondUser', 'password', 14, '2');
    const thirdUser = new User('thirdUser', 'password', 38, '3');
    map.set(defaultUser.id, defaultUser);
    map.set(secondUser.id, secondUser);
    map.set(thirdUser.id, thirdUser);
}

export function isUserExist(id) {
    return storage.has(id);
}

export function getFilteredUsers(loginSubstring, limit) {
    const filteredUsers = Array.from(storage.values())
        .filter(user => containStringIgnoreCase(user.login, loginSubstring));
    return filteredUsers.splice(0, limit);
}
