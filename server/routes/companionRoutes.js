const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  addCompanion,
  updateStatus,
  equipToCompanion,
  removeItemCompanion,
} = require("../controllers/companionController");
//COMPANIONS
router.route("/").put(protect, updateStatus).post(protect, addCompanion);
router.route("/equip").put(protect, equipToCompanion);
router.route("/item").put(protect, removeItemCompanion);

module.exports = router;