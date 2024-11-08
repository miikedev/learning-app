const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')
const {getUsers, updateUser, deleteUser} = require('../controllers/userController');

router
.get('/users',authMiddleware,getUsers)
.patch('/users/:userId',authMiddleware,updateUser)
.delete('/users/:userId',authMiddleware,deleteUser)


module.exports = router;