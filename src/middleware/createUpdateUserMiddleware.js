/**
 * Middleware function to check whether the authenticated user can create a specified user.
 * 
 * @param {string} creatorRole - The role of the authenticated user.
 * @param {string} userRole - The role of the user to be created.
 * 
 * @returns {boolean} - Returns true if the authenticated user can create the specified user, false otherwise.
 * 
 * @throws Will throw an error if the creatorRole or userRole is not a valid role.
 * 
 * @example
 * const createUpdateUser = require('./createUpdateUser');
 * const USER_ROLES = require('../userRoles/roles');
 * 
 * // Admin can create any role
 * console.log(createUpdateUser(USER_ROLES.ADMIN, USER_ROLES.USER)); // Output: true
 * console.log(createUpdateUser(USER_ROLES.ADMIN, USER_ROLES.ADMIN)); // Output: true
 * 
 * // Manager can only create USER role
 * console.log(createUpdateUser(USER_ROLES.MANAGER, USER_ROLES.USER)); // Output: true
 * console.log(createUpdateUser(USER_ROLES.MANAGER, USER_ROLES.ADMIN)); // Output: false
 */
const USER_ROLES = require("../userRoles/roles");

const createUpdateUser = (creatorRole, userRole) => {
    if (creatorRole == USER_ROLES.ADMIN){
      return Object.values(USER_ROLES).includes(userRole);
    }
    if (creatorRole == USER_ROLES.MANAGER){
      return userRole == USER_ROLES.USER;
    }
}

module.exports = createUpdateUser;