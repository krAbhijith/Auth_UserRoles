const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const USER_ROLES = require('../userRoles/roles');
const createUpdateUser = require('../middleware/createUpdateUserMiddleware');

exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body.user);

    if ( !Object.values(USER_ROLES).includes(user.role)) {
      return res.status(400).send({error: "invalid user role"});
    }

    if (!createUpdateUser(req.user.role, user.role)) {
      return res.status(401).send({error: `You dont have permission for creating ${user.role}`});
    }

    await user.save();
    
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    user.token = token;
    await user.save();

    return res.status(200).send({ user: user });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.user.email });
    if (!user) {
      return res.status(400).send({ error: 'Invalid login credentials' });
    }
    const isPasswordMatch = await bcrypt.compare(req.body.user.password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).send({ error: 'Invalid login credentials' });
    }
    res.status(200).send({ user: user });
  } catch (error) {
    res.status(400).send(error);
  }
};