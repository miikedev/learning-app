const User = require('../models/User')

const register = async (req,res) => {
    try {
        
        const {username, email, password, is_creator} = req.body;
        const user = new User({username, email, isCreator: is_creator});
        user.setPassword(password);
        user.save();
        user.token = user.generateToken();

        res.json({
            success: true,
            message: 'User registered successfully',
            username: user.username,
            email: user.email,
            is_creator: user.isCreator,
            token: user.token,
        })
    } catch (error) {
        res.json({success: false,message: error.message})
    }
}

const login = async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const user = await User.findOne({ $or: [{ username }, { username: username }] });

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        if (!user.validPassword(password)) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = user.generateToken();

        res.status(200).json({ 
        success: true, 
        message: 'Logged in successfully',
        data : {
            username: user.username,
            email: user.email,
            is_creator: user.isCreator,
            token: token,
            isCreator: user.isCreator,
        } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {login, register}