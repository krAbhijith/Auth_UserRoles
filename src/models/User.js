/**
 * Mongoose schema for User model.
 * @module UserSchema
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const USER_ROLES = require('../userRoles/roles');

/**
 * User schema definition.
 * @type {mongoose.Schema}
 */
const userSchema = new mongoose.Schema({
    token: {type: String, required: false},
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true, lowercase: true },
    role: {type: String, required: true},
    password: { type: String, required: true },
    bio: {type: String, required: false, default: ""}
});

/**
 * Method to transform user object before returning it.
 * @returns {Object} Transformed user object.
 */
userSchema.methods.toJSON = function(){
  const userObj = this.toObject();

  delete userObj.password;
  delete userObj.__v;
  delete userObj._id;
  
  return userObj
};

/**
 * Method to transform user object for profile.
 * @param {Object} user - Current user object.
 * @returns {Object} Transformed user object for profile.
 */
// userSchema.methods.toProfile = function (user) {
//   return {
//     name: this.name,
//     role: this.role,
//     email: this.email,
//     bio: this.bio,
//     following: user ? user.followingList.includes(this._id) : false
//   };
// };

/**
 * Middleware function to hash password before saving.
 * @param {Function} next - Callback function to continue with the next middleware.
 */
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

/**
 * Exports the User model.
 * @type {mongoose.Model}
 */
module.exports = mongoose.model('User', userSchema);