const User = require("../models/User");
// Example: Get filtered users with search by username or email

const getUsers = async (req, res) => {
  try {
    const { search } = req.query;

    // Create a filter based on the search term
    const filter = search
      ? {
          $or: [
            { username: { $regex: search, $options: "i" } }, // Case-insensitive search on username
            { email: { $regex: search, $options: "i" } }, // Case-insensitive search on email
          ],
        }
      : {};

    // Retrieve users, excluding 'hash' and 'token' fields
    const users = await User.find(filter).select("-hash -token");

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Updates a user's information.
 *
 * @param {Request} req - The incoming request.
 * @param {Response} res - The outgoing response.
 * @returns {Promise<void>}
 */
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { password, ...updateData } = req.body;

    // Retrieve user from database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user's password if provided
    if (password) {
      user.setPassword(password);
      updateData.hash = user.hash;
      updateData.salt = user.salt;
    }

    // Update user with provided data
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-hash -salt"); // Exclude sensitive fields from response

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const deletedUser = await User.findByIdAndDelete(userId).select(
      "-hash -token"
    );

    if (!deletedUser) {
      return res.status(404).json({ success:false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteMultiUsers = async (req, res) => {
  try {
    const { ids, usernames, emails } = req.body;

    if (!ids && !usernames && !emails) {
      return res
        .status(400)
        .json({ message: "Ids, usernames, or emails are required" });
    }

    const query = {};

    if (ids) {
      query._id = { $in: ids };
    }

    if (usernames) {
      query.username = { $in: usernames };
    }

    if (emails) {
      query.email = { $in: emails };
    }

    const deletedUsers = await User.deleteMany(query);

    res.status(200).json({
      success: true,
      message: `${deletedUsers.deletedCount} users deleted`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getUsers, updateUser, deleteUser, deleteMultiUsers };
