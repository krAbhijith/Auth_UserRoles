const User = require('../models/User');
const bcrypt = require('bcryptjs');
const createUpdateUser = require('../middleware/createUpdateUserMiddleware');
const USER_ROLES = require('../userRoles/roles');

/**
 * Get the current logged in user's information.
 *
 * @function getUser
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - Returns a JSON object with the user's information if successful, otherwise returns an error message.
 *
 * @example
 * // Request
 * GET /api/users/me
 *
 * // Response
 * {
 *   "user": {
 *     "name": "John Doe",
 *     "email": "johndoe@example.com",
 *     // ... other user properties
 *   }
 * }
 *
 * @example
 * // Error Response
 * {
 *   "error": "User not found"
 * }
 */
exports.getUser = async (req, res) => {
  try {
    res.status(200).send({ user: req.user });
  } catch (error) {
    res.status(400).send(error);
  }
};;

/**
 * Updates the current logged in user's information.
 *
 * @function updateSelf
 * @param {Object} req - The request object containing the user's updates.
 * @param {Object} res - The response object to send back the updated user or error.
 * @returns {void}
 *
 * @example
 * // Request
 * PUT /api/users/me
 * {
 *   "user": {
 *     "name": "John Doe",
 *     "password": "newpassword123"
 *   }
 * }
 *
 * // Response
 * {
 *   "user": {
 *     "name": "John Doe",
 *     "email": "johndoe@example.com",
 *     // ... other user properties
 *   }
 * }
 *
 * @example
 * // Error Response
 * {
 *   "error": "Invalid update"
 * }
 */
exports.updateSelf = async (req, res) => {
  try{
    const updates =  Object.keys(req.body.user);
    const allowedUpdates = req.user.role == USER_ROLES.ADMIN ? ['name', 'email', 'password', 'bio'] : ['name', 'password'];
    const isValidUpdate = updates.every(update => allowedUpdates.includes(update));
    const updations = req.body.user;

    if (!isValidUpdate){
      return res.status(400).send({ error: "Invalid update" })
    }

    if (updations.password){
      updations.password = await bcrypt.hash(updations.password, 8);
    }

    if (updations.role) {
      if ( !Object.values(USER_ROLES).includes(updations.role)) {
        return res.status(400).send({error: "invalid user role"});
      }
    }

    const user = await User.findByIdAndUpdate(req.user._id, updations, { new: true, runValidators: true });

    if (!user){
        return res.status(400).send({ error: "User not found" });
    }

    res.status(200).send({ user: user })

  }catch(err) {
    res.status(500).send({ error: `internal server error`});
  }
};

/**
 * Updates a user's information by their email.
 *
 * @function updateUserByEmail
 * @param {Object} req - The request object containing the user's email and updates.
 * @param {Object} res - The response object to send back the updated user or error.
 * @returns {void}
 *
 * @example
 * // Request
 * PUT /api/users/:email
 * {
 *   "user": {
 *     "name": "John Doe",
 *     // ... other user properties
 *   }
 * }
 *
 * // Response
 * {
 *   "user": {
 *     "name": "John Doe",
 *     "email": "johndoe@example.com",
 *     // ... other user properties
 *   }
 * }
 *
 * @example
 * // Error Response
 * {
 *   "error": "User not found"
 * }
 *
 * @example
 * // Error Response
 * {
 *   "error": "Invalid update"
 * }
 *
 * @example
 * // Error Response
 * {
 *   "error": "invalid user role"
 * }
 */
exports.updateUserByEmail = async (req, res) => {
  try{
    const updates =  Object.keys(req.body.user);
    const allowedUpdates = req.user.role == USER_ROLES.ADMIN ? ['name', 'email', 'password', 'bio', 'role'] : ['name', 'email', 'password', 'bio'];
    const updations = req.body.user;

    const email = req.params.email;
    const user = await User.findOne({email: email});

    if (!user){
      return res.status(404).send({ error: "User not found" });
    }

    const isValidUpdate = updates.every(update => allowedUpdates.includes(update));

    if (!isValidUpdate || !createUpdateUser(req.user.role, user.role)){
      return res.status(401).send({ error: "Invalid update" })
    }
  
    if (updations.password){
        updations.password = await bcrypt.hash(updations.password, 8);
    }

    if (updations.role) {
      if ( !Object.values(USER_ROLES).includes(updations.role)) {
        return res.status(400).send({error: "invalid user role"});
      }
    }

    const updatedUser = await User.findByIdAndUpdate(user._id, updations, { new: true, runValidators: true });

    res.status(200).send({ user: updatedUser })
    
  }catch(error) {
    res.status(500).send({ error: `internal server error : ${error.message}`});
  }
};

/**
 * Deletes a user from the database.
 *
 * @function deleteUser
 * @param {Object} req - The request object containing the user's email (optional) and the authenticated user's role.
 * @param {Object} res - The response object to send back the success message or error.
 * @returns {void}
 *
 * @example
 * // Request
 * DELETE /api/users/:email
 *
 * // Response
 * {
 *   "message": "User deleted successfully"
 * }
 *
 * @example
 * // Error Response
 * {
 *   "error": "User not found"
 * }
 *
 * @example
 * // Error Response
 * {
 *   "error": "You don't have permission to perform this action"
 * }
 *
 * @example
 * // Error Response
 * {
 *   "error": "You are the only admin. You canot perform this action"
 * }
 */
exports.deleteUser = async (req, res) => {
  try {
    const email = req.params.email;
    const user = email ? await User.findOne({email: email}) : req.user;
    
    if (!user) {
      return res.status(404).send({error: "User not found"});
    }
    if (!createUpdateUser(req.user.role, user.role)) {
      return res.status(401).send({error: `You don't have permission to perform this action`});
    }

    if (user.role == USER_ROLES.ADMIN){
      const users = await User.find({role: USER_ROLES.ADMIN});
      if (users.length == 1) {
        return res.status(400).send({error : "You are the only admin. You canot perform this action"})
      }
    }

    await User.findByIdAndDelete(user._id);
    return res.status(200).send({message: "User deleted successfully"})

  } catch (error) {
    return res.status(400).send({error: `Internal server error ${error.message}`})
  }
};

// exports.getProfile =  async (req, res) => {
//     try {
//         const user = req.user;

//         const profileResponse = user.toProfile(user);

//         res.status(200).send({ profile: profileResponse });
//     }catch (error) {

//         res.status(500).send({ error: 'internal server error' });
//     }
// };