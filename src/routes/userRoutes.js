const express = require('express');
const { getUser, getProfile, updateSelf, updateUserByEmail} = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const optionalAuth = require('../middleware/optionalAuthMiddleware');
const { getTags } = require('../controllers/articleController');
const USER_ROLES = require('../userRoles/roles');
const router = express.Router();

router.get('/user', auth, getUser);
router.put('/user', auth, updateSelf);
router.put('/user/:email', auth, updateUserByEmail);
router.get('/profile', auth, getProfile);
// router.post('/profiles/:username/follow', auth, follow);
// router.delete('/profiles/:username/follow', auth, unfollow);

router.get('/tags', getTags);

module.exports = router;