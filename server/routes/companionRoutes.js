const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  addCompanion,
  updateStatus,
  equipToCompanion,
  removeItemCompanion,
  getCompanion,
  getSlotsAvailable,
  getEquipable,
} = require("../controllers/companionController");
//COMPANIONS
router.route("/").get(protect, getCompanion).put(protect, updateStatus).post(protect, addCompanion);
router.route("/slots").get(protect, getSlotsAvailable);
router.route("/equipable").get(protect, getEquipable);
router.route("/equip").put(protect, equipToCompanion);
router.route("/item").put(protect, removeItemCompanion);

module.exports = router;