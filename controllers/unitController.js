const multer = require("multer");
const Unit = require("../models/Unit");
const cloudinary = require("../config/cloudinary");
const { uploadImage } = require("../services/cloudinary");
const fs = require("fs");
const { uploadFile } = require("../middleware/uploadMiddleware");
// Get All Units (with searching and ordering)
exports.getAllUnits = async (req, res) => {
  try {
    const { search, sortBy, order = "asc" } = req.query;

    // Search Filter
    const searchQuery = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { contact: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // Sorting
    const sortQuery = sortBy ? { [sortBy]: order === "desc" ? -1 : 1 } : {};

    const units = await Unit.find(searchQuery)
      .sort(sortQuery)
      .populate("position_id");
    res.status(200).json(units);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get Unit by ID
exports.getUnitById = async (req, res) => {
  try {
    const unit = await Unit.findById(req.params.id).populate("position_id");
    if (!unit) {
      return res.status(404).json({ message: "Unit not found" });
    }
    res.status(200).json(unit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const uploadFileToCloudinary = (fileBuffer) => {
  const stream = fs.createReadStream(file.filepath); // Correctly reading the file as a stream

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream((error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      })
      .end(stream); // End the stream with the file
  });
};
// exports.createUnit = async (req, res) => {
//   const bb = busboy({ headers: req.headers });
//   let fileBuffer;
//   const unitData = {};

//   bb.on('file', (name, file, info) => {
//     const chunks = [];
//     file.on('data', (chunk) => chunks.push(chunk));
//     file.on('end', () => {
//       fileBuffer = Buffer.concat(chunks);
//     });
//   });

//   bb.on('field', (name, val) => {
//     unitData[name] = val;
//   });

//   bb.on('finish', async () => {
//     try {
//       if (!fileBuffer) {
//         return res.status(400).json({ error: "No file uploaded" });
//       }

//       // Start file upload
//       const uploadPromise = uploadFileToCloudinary(fileBuffer);

//       // Create new unit instance
//       const unit = new Unit(unitData);

//       // Wait for both operations to complete
//       const [uploadResult, savedUnit] = await Promise.all([
//         uploadPromise,
//         unit.save()
//       ]);

//       // Update the unit with the offer letter URL
//       savedUnit.offer_letter = uploadResult.secure_url;
//       await savedUnit.save();

//       // Convert to plain object
//       const plainUnit = savedUnit.toObject();

//       res.status(201).json({ message: "Unit created successfully", unit: plainUnit });
//     } catch (error) {
//       console.error('Error:', error);
//       res.status(500).json({ error: error.message });
//     }
//   });

//   req.pipe(bb);
// };
// Update Unit
exports.createUnit = async function (req, res) {
  uploadFile(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(501).json({ error: err.message });
    }

    try {
      console.log(req.body);
      if (req.files) {
        console.log(req.files.offer_letter[0].buffer);
        const imageStream = req.files.offer_letter[0].buffer;
        const imageName = new Date().getTime().toString() + "_offer_letter";
        const uploaded = await uploadImage(imageStream, imageName);
        const url = uploaded.secure_url;
        await Unit.create({ ...req.body, offer_letter: url });
        res.json({ success: true, msg: "upload unit successfully created" });
      }
    } catch (error) {
      // Handle errors during upload or saving
      console.log(error);
      res.status(500).json({
        error: "An error occurred while creating the unit.",
        details: error.message,
      });
    }
  });
};
exports.updateUnit = async (req, res) => {
  try {
    const { status, ...unitData } = req.body;
    let unit = await Unit.findById(req.params.id);

    if (!unit) {
      return res.status(404).json({ message: "Unit not found" });
    }

    // Update offer letter if status is truthy and file is uploaded
    if (status && req.file) {
      unitData.offer_letter = req.file.location; // S3 URL
    } else if (!status) {
      unitData.offer_letter = null; // Remove offer letter if status is false
    }

    unit = await Unit.findByIdAndUpdate(
      req.params.id,
      { ...unitData, status },
      { new: true }
    );
    res.status(200).json({ message: "Unit updated successfully", unit });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Unit
exports.deleteUnit = async (req, res) => {
  try {
    const unit = await Unit.findByIdAndDelete(req.params.id);
    if (!unit) {
      return res.status(404).json({ message: "Unit not found" });
    }
    res.status(200).json({ message: "Unit deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Bulk Delete
exports.bulkDelete = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !ids.length) {
      return res.status(400).json({ message: "No IDs provided" });
    }
    await Unit.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: "Units deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Bulk Status Update
exports.bulkStatus = async (req, res) => {
  try {
    const { ids, status } = req.body;
    if (!ids || typeof status === "undefined") {
      return res.status(400).json({ message: "Invalid data provided" });
    }
    await Unit.updateMany({ _id: { $in: ids } }, { status });
    res.status(200).json({ message: "Units' statuses updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
