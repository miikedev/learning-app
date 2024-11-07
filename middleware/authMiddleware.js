const jwt = require('jsonwebtoken');  
const User = require('../models/User'); // Adjust the path as needed  

const authMiddleware = async (req, res, next) => {  
    console.log(req.headers['authorization']);
    
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];  
    console.log(token)
    if (!token) {  
        return res.status(401).json({ success: false, message: 'No token provided' });  
    }  

    try {  
        const {userId} = jwt.verify(token, process.env.JWT_SECRET); // Use your secret key here  
        console.log('decoded token: ' + userId);
        
        req.user = await User.findById(userId); 
        console.log(req.user) 
        if (!req.user) {  
            return res.status(401).json({ success: false, message: 'Invalid token' });  
        }  
        next(); // Continue to the next middleware or route handler  
    } catch (error) {  
        return res.status(500).json({ success: false, message: 'Failed to authenticate token' });  
    }  
};  

module.exports = authMiddleware;