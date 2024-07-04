const express = require('express');
const { createUser, login } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', auth, createUser);
router.post('/login', login);

module.exports = router;