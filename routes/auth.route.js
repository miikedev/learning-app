const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {login, register, logout} = require('../controllers/authController');

router.post('/login',login).post('/register',register).post('/logout',authMiddleware,logout);

module.exports = router;