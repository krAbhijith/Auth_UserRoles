const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const USER_ROLES = require('../userRoles/roles');

const userSchema = new mongoose.Schema({
    token: {type: String, required: false},
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true, lowercase: true },
    role: {type: String, required: true},
    password: { type: String, required: true },
    bio: {type: String, required: false, default: "Hai Hell....!"}

    // followingList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    // followersList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    // favoritesList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article'}],
});

userSchema.methods.toJSON = function(){
  const userObj = this.toObject();

  delete userObj.password;
  delete userObj.__v;
  delete userObj._id;
  // delete userObj.followingList;
  // delete userObj.followersList;
  // delete userObj.favoritesList;
  
  return userObj
};

// userSchema.methods.toProfile = function (user) {
//   return {
//     name: this.name,
//     role: this.role,
//     email: this.email,
//     bio: this.bio,
//     following: user ? user.followingList.includes(this._id) : false
//   };
// };

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);