const User = require('../models/User')
const getUsers = async (req,res) => {
    const users = await User.find({}).select('-hash -token -salt');
    res.json({
        success: true,
        users: users,
    })
}

const updateUser = async (req,res) => {
    res.json({success: true})
}

const deleteUser = async (req,res) => {
    res.json({success: true})
}

module.exports = {getUsers, updateUser, deleteUser}