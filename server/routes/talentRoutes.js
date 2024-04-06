const express = require("express");
const router = express.Router();
const {
  getTalent,
  getUserBonus,
  setTalent,
  updateTalent,
  deleteTalent,
  putUserTalent,
  addUserTalent,
  removeUserTalent,
  getPlayerTalent,
} = require("../controllers/talentController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(getTalent).post(setTalent);
router.route("/:id").put(protect, updateTalent).delete(protect, deleteTalent);

/*Players talents */
//TALENTS
router
  .route("/to_player/")
  .put(protect, putUserTalent)
  .post(protect, addUserTalent);
router.route("/player").get(protect, getPlayerTalent);
router.route("/userboni").get(protect, getUserBonus);
router.route("/from_player/:id").delete(protect, removeUserTalent);

module.exports = router;
