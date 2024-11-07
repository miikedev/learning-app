const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')
const {login, register, users} = require('../controllers/authController');

router.post('/login',login).post('/register',register).get('/users',authMiddleware,users);

module.exports = router;