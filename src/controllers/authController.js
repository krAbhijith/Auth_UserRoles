const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const USER_ROLES = require('../userRoles/roles');
const createUpdateUser = require('../middleware/createUpdateUserMiddleware');

/**
 * Creates a new user in the database.
 *
 * @param {Object} req - The request object containing the user's data.
 * @param {Object} res - The response object to send back to the client.
 * @returns {void}
 */
exports.createUser = async (req, res) => {
  try {
    // Create a new User instance from the request body
    const user = new User(req.body.user);

    // Check if the provided user role is valid
    if ( !Object.values(USER_ROLES).includes(user.role)) {
      // If the role is invalid, send a 400 status code with an error message
      return res.status(400).send({error: "invalid user role"});
    }

    // Check if the current user has permission to create the provided user role
    if (!createUpdateUser(req.user.role, user.role)) {
      // If the user does not have permission, send a 401 status code with an error message
      return res.status(401).send({error: `You don't have permission for creating ${user.role}`});
    }

    // Save the new user to the database
    await user.save();
    
    // Generate a JWT token for the user
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    // Add the token to the user object
    user.token = token;
    // Save the updated user to the database
    await user.save();

    // Send a 200 status code with the user object
    return res.status(200).send({ user: user });
  } catch (error) {
    // If any error occurs during the process, send a 400 status code with the error message
    return res.status(400).send(error.message);
  }
};;

/**
 * Handles user login.
 *
 * @param {Object} req - The request object containing the user's email and password.
 * @param {Object} res - The response object to send back to the client.
 * @returns {void}
 */
exports.login = async (req, res) => {
  try {
    // Find the user by their email
    const user = await User.findOne({ email: req.body.user.email });

    // If the user does not exist, return an error
    if (!user) {
      return res.status(400).send({ error: 'Invalid login credentials' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordMatch = await bcrypt.compare(req.body.user.password, user.password);

    // If the passwords do not match, return an error
    if (!isPasswordMatch) {
      return res.status(400).send({ error: 'Invalid login credentials' });
    }

    // If the login is successful, send the user object back to the client
    res.status(200).send({ user: user });
  } catch (error) {
    // If any error occurs during the login process, send the error message back to the client
    res.status(400).send(error);
  }
};;