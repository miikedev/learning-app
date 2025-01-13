const Position = require("../models/Position");

exports.createPosition = async (req, res) => {
  try {
    const { name, code } = req.body;

    const position = await Position.create({ name, code });
    res
      .status(201)
      .json({ message: "Position created successfully", position });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllPositions = async (req, res) => {
  try {
    const { search, orderBy = "createdAt", order = "asc" } = req.query;
    const sortOrder = order === "asc" ? 1 : -1;

    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { code: { $regex: search, $options: "i" } },
        ],
      };
    }

    const positions = await Position.find(query).sort({ [orderBy]: sortOrder });
    res.status(200).json({ positions });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updatePosition = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code } = req.body;

    const position = await Position.findByIdAndUpdate(
      id,
      { name, code },
      { new: true }
    );
    if (!position) {
      return res.status(404).json({ message: "Position not found" });
    }

    res
      .status(200)
      .json({ message: "Position updated successfully", position });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletePosition = async (req, res) => {
  try {
    const { id } = req.params;

    const position = await Position.findByIdAndDelete(id);
    if (!position) {
      return res.status(404).json({ message: "Position not found" });
    }

    res.status(200).json({ message: "Position deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.bulkDeletePositions = async (req, res) => {
  try {
    const { ids } = req.body; // Array of position IDs

    await Position.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: "Positions deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
