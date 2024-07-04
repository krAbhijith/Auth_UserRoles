const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware function for authenticating requests.
 * It verifies the JWT token in the request header and populates the req.user with the corresponding user data.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function in the stack
 *
 * @returns {void}
 *
 * @throws Will throw an error if the JWT token is invalid or the user is not found.
 */
const auth = async (req, res, next) => {
  try {
    // Extract the JWT token from the request header
    const token = req.header('Authorization').replace('Bearer ', '');

    // Verify the JWT token using the JWT_SECRET environment variable
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user in the database using the decoded user ID
    const user = await User.findOne({ _id: decoded._id });

    // If the user is not found, return a 404 error
    if (!user) {
      return res.status(404).send({error: "user not found"});
    }

    // If the user is found, populate the req.user with the user data and call the next middleware function
    req.user = user;
    next();
  } catch (error) {
    // If the JWT token is invalid or the user is not found, return a 401 error
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

module.exports = auth;