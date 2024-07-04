const User = require('../models/User');
const bcrypt = require('bcryptjs');
const createUpdateUser = require('../middleware/createUpdateUserMiddleware');
const USER_ROLES = require('../userRoles/roles');

exports.getUser = async (req, res) => {
  try {
    res.status(200).send({ user: req.user});
  } catch (error) {
    res.status(400).send(error);
  }
};

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


// exports.follow = async (req, res) => {
//     try {
//       const usernameToFollow = req.params.username;
//       const follower = req.user;
//       const userToFollow = await User.findOne({username: usernameToFollow}); 

//       following= follower.followingList.includes(userToFollow._id )

//       if(!userToFollow){
//         return res.status(400).send({ error: "User not found" });
//       }

//       if (follower.username === usernameToFollow){
//         return res.status(400).send({ error: "You canot follow yourself" });
//       }

//       profile = {
//         "username": userToFollow.username,
//         "bio": userToFollow.bio,
//         "image": userToFollow.image,
//         "following": !following,
//       }

//       if (following){
//         return res.status(200).send({ error: `You already following ${ userToFollow.username }` }); 
//       }

//       follower.followingList.push(userToFollow.id);
//         await follower.save();

//       userToFollow.followersList.push(follower.id);
//         await userToFollow.save();

//       res.status(200).send({ profile: profile });

//     } catch (error) {
//         console.log(error);
//     }
// };



// exports.unfollow = async (req, res) => {
//     try {
//         const usernameToUnfollow = req.params.username;
//         const follower = req.user;
//         const userToUnfollow = await User.findOne({username: usernameToUnfollow}); 

//         following= follower.followingList.includes(userToUnfollow._id )

//         if(!userToUnfollow){
//             return res.status(400).send({ error: "User not found" });
//         }

//         if (follower.username === usernameToUnfollow){
//             return res.status(400).send({ error: "You canot follow yourself" });
//         }
          
//         if (!following){
//           return res.status(400).send({ error: `you are not following ${userToUnfollow.username} to unfollow` });
//         }

//         profile = {
//             "username": userToUnfollow.username,
//             "bio": userToUnfollow.bio,
//             "image": userToUnfollow.image,
//             "following": !following,
//         }

//         follower.followingList = follower.followingList.filter(id => !id.equals(userToUnfollow._id));
//         userToUnfollow.followersList = userToUnfollow.followersList.filter(id => !id.equals(follower._id));

//         await follower.save();
//         await userToUnfollow.save();
        
//         res.status(200).send({ profile: profile });

//     } catch (error) {
//         console.log(error);
//     }
// };