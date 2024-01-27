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
     getInventory,
     putAmount,
     substractAmount,
     getWeapons,
     unequipItem,
     getMoney,
     updateMoney,
    } =  require("../controllers/inventoryController");

const { protect } = require("../middleware/authMiddleware");

// Add to inventory from items Db
router
  .route("/")
 .get(protect, getInventory)
  .post(protect, addToInventory)

//get equipped weapons
router
.route("/weapons")
.get(protect, getWeapons)
router
.route("/money")
.get(protect, getMoney)
.put(protect, updateMoney)
//remove iten from users inventory
router.route("/:id")
.delete(protect, removeFromInventory)
// Split stack
router.route("/split")
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
    router
    .route("/unequip")
    .put(protect, unequipItem)
// Filter users inventory by items category (weapon, armor etc)  
router
    .route("/filter/:category")
    .get(protect, getCategorizedInventory);

// Filter item db by category
router
    .route("/category")
    .get(getCategorizedItems)

// add amount 
router
    .route("/add-one")
    .put(protect,putAmount)
    router
    .route("/substract-one")
    .put(protect,substractAmount)
module.exports = router;

