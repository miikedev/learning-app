const express = require("express");
const router = express.Router();
const UnitController = require("../controllers/unitController");
// const upload = require("../middleware/uploadMiddleware");
const auth = require("../middleware/authMiddleware");
// CRUD Operations
router.post(
  "/units/",
  auth,
  // upload.single("offer_letter"),
  UnitController.createUnit
);
router.get("/units/", auth, UnitController.getAllUnits);
router.get("/units/:id", auth, UnitController.getUnitById);
router.put(
  "/units/:id",
  auth,
  // upload.single("offer_letter"),
  UnitController.updateUnit
);
router.delete("/units/:id", UnitController.deleteUnit);

// Additional Features
router.post("/units/bulk-delete", UnitController.bulkDelete);
router.put("/units/bulk-status", UnitController.bulkStatus);

module.exports = router;
