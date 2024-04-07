const asyncHandler = require("express-async-handler");
const Bonus = require("../models/bonusModel");
const User = require("../models/userModel");

// @desc Get bonis in category
// @route GET /bonus/:category
// @access Private
const getCategoryBoni = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate({
    path: "inventory.item",
    model: "Item",
    populate: {
      path: "boni",
      model: "Bonus",
    },
  });
  if (!req.user.id || !user) {
    res.status(400).json({ message: "Spieler nicht gefunden" });
  }
  const category = req.params.category;
  const rarity = {
    primitiv: "primitive",
    gewöhnlich: "common",
    hochwertig: "highgrade",

    magisch: "magical", //orange
    außergewöhnlich: "extraordinary", //lila
    selten: "rare", // grün

    sagenhaft: "amazing", // gelb
    episch: "epic", // blau
    legendär: "legendary", //rot
    einzigartig: "unique",
  };
  // all equipped bonis
  const equipped = user.inventory.filter(
    (el) => el.status === "Ausgerüstet" && el.item.boni?.length > 0
  );
  let equippedBoniCategory = [];
  let boniList = [];
  equipped.map((equipment) => {
    //TODO: add enchantment and array boni
    const boni = equipment.item.boni[0];
    console.log(`boni: ${boni}, category: ${boni.category}`);
    if (boni.category === category) {
      equippedBoniCategory.push(boni);
    }
  });
  if (!equippedBoniCategory) {
    res.status(500).json({ message: "Nichts in der Katergorie gefunden" });
  }
  // get values acc to the rarity of the bonus
  equippedBoniCategory.map((bonus) => {
    const bonusRarity = bonus.rarity;
    const bonusType = bonus.type;
    let categoryValue;
    if (category === "talent") {
      categoryValue =
        rarity[bonusRarity] === "primitive"
          ? 1
          : rarity[bonusRarity] === "common"
          ? 2
          : rarity[bonusRarity] === "highgrade"
          ? 3
          : rarity[bonusRarity] === "magical"
          ? 4
          : rarity[bonusRarity] === "extraordinary"
          ? 5
          : rarity[bonusRarity] === "rare"
          ? 6
          : rarity[bonusRarity] === "amazing"
          ? 8
          : rarity[bonusRarity] === "epic"
          ? 10
          : rarity[bonusRarity] === "legendary"
          ? 15
          : 0;
    } else if (category === "resistance") {
      if(bonusType === 'Magie'){
        categoryValue =
        rarity[bonusRarity] ===  rarity[bonusRarity] === "magical"
          ? 10
          : rarity[bonusRarity] === "extraordinary"
          ? 15
          : rarity[bonusRarity] === "rare"
          ? 20
          : rarity[bonusRarity] === "amazing"
          ? 30
          : rarity[bonusRarity] === "epic"
          ? 40
          : rarity[bonusRarity] === "legendary"
          ? 50
          : 0;
      } else {
        categoryValue =
        rarity[bonusRarity] ===  rarity[bonusRarity] === "magical"
          ? 1
          : rarity[bonusRarity] === "extraordinary"
          ? 2
          : rarity[bonusRarity] === "rare"
          ? 3
          : rarity[bonusRarity] === "amazing"
          ? 4
          : rarity[bonusRarity] === "epic"
          ? 6
          : rarity[bonusRarity] === "legendary"
          ? 8
          : 0;
      }

    }
    // Check if the bonus type already exists in boniList
    const existingBonusIndex = boniList.findIndex(
      (item) => item.bonus.type === bonusType
    );
    if (existingBonusIndex !== -1) {
      // If it exists, add the value to the existing one
      boniList[existingBonusIndex].value += categoryValue;
    } else {
      // If it doesn't exist, push a new entry to boniList
      boniList.push({ bonus: bonus, value: categoryValue });
    }
  });
  console.log(boniList);
  res.status(200).json({ boni: boniList, category: req.params.category });
});

module.exports = { getCategoryBoni };
