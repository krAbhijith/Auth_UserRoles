const express = require('express');
const { getUser, updateUser, getProfile} = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const optionalAuth = require('../middleware/optionalAuthMiddleware');
const { getTags } = require('../controllers/articleController');
const USER_ROLES = require('../userRoles/roles');
const router = express.Router();

router.get('/user', auth, getUser);
router.put('/user', auth, updateUser);
router.get('/profile', auth, getProfile);
// router.post('/profiles/:username/follow', auth, follow);
// router.delete('/profiles/:username/follow', auth, unfollow);

router.get('/tags', getTags);

module.exports = router;