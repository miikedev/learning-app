const User = require("../models/User");
const logger = require('../logs')
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log(req.body)
    const user = new User({ username, email });
    user.setPassword(password);
    await user.save();
    user.token = user.generateToken();
    // Store user ID in the session to indicate logged-in status
    req.session.userId = user._id;
    res.json({
      success: true,
      message: "User registered successfully",
      data: {
        _id: user._id, // The user's unique ID
        username: user.username,
        email: user.email,
      },
      token: user.token,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ username }, { username: username }],
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    if (!user.validPassword(password)) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = user.generateToken();
    // Store user ID in the session to maintain login state
    logger.info('retrieved user _id',user._id)

    req.session.userId = user._id;
    // logger.info('user id stored from user._id',req.session.userId)
    
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: {
        _id: user._id, // The user's unique ID
        username: user.username,
        email: user.email,
      },
      token: token,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: error.message });
  }
};
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Logout failed" });
    }
    res.clearCookie("connect.sid"); // Optional: clear the session cookie
    res.status(200).json({ success: true, message: "Logged out successfully" });
  });
};

module.exports = { login, register, logout };
