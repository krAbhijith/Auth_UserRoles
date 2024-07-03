const USER_ROLES = require("../userRoles/roles");

//Middileware function to check wheather the authenticated user can create specified user
const createUpdateUser = (creatorRole, userRole) => {
    if (creatorRole == USER_ROLES.ADMIN){
      return Object.values(USER_ROLES).includes(userRole);
    }
    if (creatorRole == USER_ROLES.MANAGER){
      return userRole == USER_ROLES.USER;
    }
}
module.exports = createUpdateUser;