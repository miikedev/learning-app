const mongoose = require("mongoose");

const UnitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  code: { 
    type: String,
    unique: true,
    trim: true,
   },
  unit_type: { 
    type: String, 
    enum: ["state", "district", "township"], 
    required: true 
  },
  status: { type: Boolean, default: false },
  offer_letter: { type: String },
  position_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Position", 
    required: true 
  },
}, { timestamps: true });
UnitSchema.pre("save", async function (next) {
  if (!this.code) {
    const generateCode = () => {
      return Math.random().toString(36).substring(2, 8).toUpperCase(); // Generate 6-character alphanumeric code
    };

    let unique = false;
    let newCode;

    while (!unique) {
      newCode = generateCode();
      const existing = await mongoose.models.Unit.findOne({ code: newCode });
      if (!existing) unique = true;
    }

    this.code = newCode;
  }
  next();
});
module.exports = mongoose.model("Unit", UnitSchema);