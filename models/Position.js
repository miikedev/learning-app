const mongoose = require("mongoose");

const positionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Pre-save middleware to auto-generate a 6-character code
positionSchema.pre("save", async function (next) {
  if (!this.code) {
    const generateCode = () => {
      return Math.random().toString(36).substring(2, 8).toUpperCase(); // Generate 6-character alphanumeric code
    };

    let unique = false;
    let newCode;

    while (!unique) {
      newCode = generateCode();
      const existing = await mongoose.models.Position.findOne({ code: newCode });
      if (!existing) unique = true;
    }

    this.code = newCode;
  }
  next();
});

const Position = mongoose.model("Position", positionSchema);

module.exports = Position;