const express = require("express");
const router = express.Router();
const {
     addToInventory, 
     getCategorizedInventory,
     getCategorizedItems,
     equipItem,
     removeFromInventory,
     splitAmount,
     shareWith,
    } =  require("../controllers/inventoryController");

const { protect } = require("../middleware/authMiddleware");

// Add to inventory from items Db
router
  .route("/")
//  .put(protect, updateInventory)
  .post(protect, addToInventory)

router.route("/:id")
.delete(protect, removeFromInventory)
.put(protect, splitAmount)

// Share with ozher user
router
  .route("/share")
//  .put(protect, updateInventory)
  .post(protect, shareWith)

// Equip item to the user
router
    .route("/equip")
    .put(protect, equipItem)
// Filter users inventory by items category (weapon, armor etc)  
router
    .route("/sorted")
    .get(protect, getCategorizedInventory);

// Filter item db by category
router
    .route("/category")
    .get(getCategorizedItems)
module.exports = router;

