const express = require("express");
const router = express.Router();
const {
  getPlayer,
  setEnchantment,
  uploadPicture,
  updateLevel,
  createCharacter,
  getLevel,
  //updateBalance,
} = require("../controllers/playerController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getPlayer);
router.route("/level").put(protect, updateLevel).get(protect, getLevel);
router.route("/enchantment").put(protect, setEnchantment);
//router.route("/balance").put(protect, updateBalance);
//CREATE CHARACTER
router.route("/profilepic").post(protect, uploadPicture);
router.post("/create", protect, createCharacter);


module.exports = router;
