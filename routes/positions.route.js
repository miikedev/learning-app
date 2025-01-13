const express = require("express");
const router = express.Router();
const PositionController = require("../controllers/positionController");

// CRUD Operations
router.post("/positions/", PositionController.createPosition);
router.get("/positions/", PositionController.getAllPositions);
router.put("/positions/:id", PositionController.updatePosition);
router.delete("/positions/:id", PositionController.deletePosition);

// Bulk Operations
router.post("/bulk-delete", PositionController.bulkDeletePositions);

module.exports = router;