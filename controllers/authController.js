const User = require("../models/User");

const register = async (req, res) => {
  try {
    const { username, email, password, is_creator } = req.body;
    const user = new User({ username, email, isCreator: is_creator });
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
        is_creator: user.isCreator,
        token: user.token,
        isCreator: user.isCreator,
      },
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
    req.session.userId = user._id;
    
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: {
        _id: user._id, // The user's unique ID
        username: user.username,
        email: user.email,
        is_creator: user.isCreator,
        token: token,
        isCreator: user.isCreator,
      },
    });
  } catch (error) {
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
