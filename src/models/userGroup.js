import { Permission } from './permission.js';


const storageUserGroup = new Map();

function UserGroup(id, name, permissions) {
    this.id = id;
    this.name = name;
    if (!permissions) {
        this.permissions = [];
    } else {
        this.permissions = permissions;
    }
}

function initUserGroups() {
    const adminGroup = new UserGroup('admin', 'adminGroup', [Permission.READ, Permission.WRITE, Permission.DELETE, Permission.SHARE, Permission.UPLOAD_FILES]);
    const employeeGroup = new UserGroup('employee', 'employeeGroup', [Permission.READ, Permission.WRITE]);
    storageUserGroup.set(adminGroup.id, adminGroup);
    storageUserGroup.set(employeeGroup.id, employeeGroup);
}

function getAllGroups() {
    return Array.from(storageUserGroup.values());
}

function isUserGroupExist(id) {
    return storageUserGroup.has(id);
}

function getUserGroupById(id) {
    return storageUserGroup.get(id);
}

export { storageUserGroup, UserGroup, isUserGroupExist, getAllGroups, getUserGroupById, initUserGroups };
