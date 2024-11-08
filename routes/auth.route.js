const express = require('express');
const router = express.Router();
const {login, register, users} = require('../controllers/authController');

router.post('/login',login).post('/register',register);

module.exports = router;