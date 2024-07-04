const express = require('express');
const { getUser, updateSelf, updateUserByEmail, deleteUser} = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/user', auth, getUser);
router.put('/user', auth, updateSelf);
router.put('/user/:email', auth, updateUserByEmail);
router.delete('/user', auth, deleteUser);
router.delete('/user/:email', auth, deleteUser);
// router.get('/profile', auth, getProfile);

module.exports = router;