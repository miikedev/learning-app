const express = require('express');
const router = express.Router();
const {login, register, users} = require('../controllers/authController');

router.post('/login',login).post('/register',register).get('/users',users);


module.exports = router;