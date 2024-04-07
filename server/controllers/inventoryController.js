const asyncHandler = require("express-async-handler");
const Item = require("../models/itemsModel");
const Inventory = require("../models/inventoryModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

// @desc get users inventory
// @route GET /inventory
// @access Private
const getInventory = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate({
    path: "inventory.item",
    model: "Item",
    populate: {
      path: "material.element",
      model: "Item",
    },
  });
  if (!user) {
    res.status(500).json({ message: "User nicht gefunden" });
  } else {
    const inventory = user.inventory ? user.inventory : {};
    res.status(200).json({ data: inventory });
  }
});

// @desc get users weapons
// @route GET /inventory/weapons
// @access Private
const getWeapons = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate({
    path: "inventory.item",
    model: "Item",
    populate: {
      path: "material.element",
      model: "Item",
    },
  });
  if (!user) {
    res.status(500).json({ message: "User nicht gefunden" });
  } else {
    const inventory = user.inventory?.filter(
      (el) => el.status === "Ausgerüstet"
    );
    const equippedWeapons = inventory.filter(
      (el) => el.item.category === "Waffe" || el.item.genus === "Schild"
    );
    if (equippedWeapons.length === 1) {
      //console.log("only 1 weapon found")
      res
        .status(200)
        .json({ mainWeapon: equippedWeapons[0], secondWeapon: null });
    } else if (equippedWeapons.length === 2) {
      //console.log("more than 1 weapon equipped")
      res.status(200).json({
        mainWeapon: equippedWeapons[0],
        secondWeapon: equippedWeapons[1],
      });
    } else {
      //console.log("no weapons or shields equipped")
      res.status(200).json([{ mainWeapon: null, secondWeapon: null }]);
    }
  }
});

// @desc get users inventory
// @route PUT /inventory/add-one
// @access Private
const putAmount = asyncHandler(async (req, res) => {
  const { invId } = req.body;
  if (!invId) {
    return res.status(400).json({ message: "Id not provided" });
  }
  const user = await User.findById(req.user.id).populate({
    path: "inventory.item",
    model: "Item",
    populate: {
      path: "material.element",
      model: "Item",
    },
  });
  if (!user) {
    return res.status(500).json({ message: "User not found" });
  }
  const oldItem = user.inventory?.find(
    (el) => el._id.toString() === invId.toString()
  );
  if (oldItem) {
    const updated = await User.findOneAndUpdate(
      { user: req.user.id, "inventory._id": invId },
      { $inc: { "inventory.$.amount": 1 } },
      { new: true }
    ).populate({
      path: "inventory.item",
      model: "Item",
      populate: {
        path: "material.element",
        model: "Item",
      },
    });

    if (!updated) {
      return res.status(400).json({ message: "Failed to update" });
    }
    const updatedItem = updated?.inventory?.find(
      (el) => el._id.toString() === invId.toString()
    );
    return res.status(200).json(updatedItem);
  }
  return res.status(400).json({ msg: "Error" });
});

// @desc get users inventory
// @route PUT /inventory/sub-one
// @access Private
const substractAmount = asyncHandler(async (req, res) => {
  const { invId } = req.body;
  if (!invId) {
    return res.status(400).json({ message: "Id not provided" });
  }
  const user = await User.findById(req.user.id).populate({
    path: "inventory.item",
    model: "Item",
    populate: {
      path: "material.element",
      model: "Item",
    },
  });
  if (!user) {
    return res.status(500).json({ message: "User not found" });
  }
  const oldItem = user.inventory?.find(
    (el) => el._id.toString() === invId.toString()
  );
  if (oldItem) {
    const updated = await User.findOneAndUpdate(
      { user: req.user.id, "inventory._id": invId },
      { $inc: { "inventory.$.amount": -1 } },
      { new: true }
    ).populate({
      path: "inventory.item",
      model: "Item",
      populate: {
        path: "material.element",
        model: "Item",
      },
    });

    if (!updated) {
      return res.status(400).json({ message: "Failed to update" });
    }
    const updatedItem = updated?.inventory?.find(
      (el) => el._id.toString() === invId.toString()
    );
    return res.status(200).json(updatedItem);
  }
  return res.status(400).json({ msg: "Error" });
});
// @desc Add item to users inventory
// @route POST /inventory
// @access Private
const toInventory = asyncHandler(async (req, res) => {
  if (!req.body.amount || !req.body.item || !req.body.status) {
    res.status(400);
    throw new Error("Bitte überprüfe deine Eingabe!");
  }
  const item = await Item.findById(req.body.item);
  if (!item) {
    res.status(400);
    throw new Error("Item nicht gefunden...");
  }
  // new item from the db - add to inventory
  const inventory = await Inventory.create({
    item: item,
    amount: req.body.amount,
    status: req.user.name,
  });
  if (!inventory) {
    res.status(400);
    throw new Error("Item konnte weder erstellt noch updated werden...");
  }
  const created = await User.findByIdAndUpdate(
    req.user.id,
    { $push: { inventory: inventory } },
    { new: true }
  );
  if (!created) {
    res.status(400);
    throw new Error("Item konnte nicht zum Nutzer hinzugefügt werden...");
  }
  console.log("Item wurde erstellt und hinzgefügt");
  res.status(200).json({
    _id: inventory._id,
    item: item,
    amount: req.body.amount,
    status: req.user.name,
  });
});
// @desc Add item to users inventory
// @route get /capacity/
// @access Private
const getLoadCapacity = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate({
    path: "companions.creature",
    model: "Bestiarium",
  });
  const strength = user?.attributes?.strength;
  if (!user || !strength) {
    res.status(400).json("Stärke ofer Nutzer nicht gefunden");
  }
  const multiplier =
    strength >= 1 && strength <= 5
      ? 1
      : strength >= 6 && strength <= 10
      ? 2
      : strength >= 11 && strength <= 15
      ? 3
      : strength >= 16 && strength <= 20
      ? 4
      : 0;
  const userStrength = strength * multiplier;
  const companionList = user.companions;
  if (!companionList) {
    res.status(200).json(userStrength);
  }
  let companionWeight = 0;
  companionList.forEach((companion) => {
    if (companion.status !== "Stall") {
      const creatureWeight = companion.creature?.capacity;
      companionWeight += creatureWeight;
    }
  });
  const loadCapacity = userStrength + companionWeight;
  res.status(200).json(loadCapacity);
});
// @desc Add item to users inventory
// @route get /armor/
// @access Private
const getArmor = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate({
    path: "inventory.item",
    model: "Item",
  });
  const inventory = user?.inventory;
  if (!user || !inventory) {
    res.status(400).json("Inventar oder Nutzer nicht gefunden");
  }

  //calculate armor of all equipped items
  const fullEquipment = inventory.filter((el) => el.status === "Ausgerüstet");
  const armor = fullEquipment.reduce(
    (sum, item) => sum + item.item.value,
    0
  );
  // calculate armor class depending on the weight of the equipped items
  const relevantItemTypes = ["Brust", "Beine", "Kopf", "Arme", "Füße", "Hüfte"];
  const equipped = inventory.filter(
    (el) =>
      el.status === "Ausgerüstet" &&
      relevantItemTypes.some((value) => el.item.genus.includes(value))
  );
  const equipmentWeight = equipped.reduce(
    (sum, item) => sum + item.item.weight,
    0
  );
  const armorCategory =
    equipmentWeight >= 0 && equipmentWeight <= 1.6
      ? 1
      : equipmentWeight >= 1.7 && equipmentWeight <= 3.9
      ? 2
      : equipmentWeight >= 4 && equipmentWeight <= 6.5
      ? 3
      : equipmentWeight >= 6.6 && equipmentWeight <= 10
      ? 4
      : 0;
  res.status(200).json({armor: armor, armorCategory: armorCategory });
});
// @desc Add item to users inventory
// @route get /money/
// @access Private

const getMoney = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const money = user?.money;
  if (!money || !user) {
    res.status(400).json("no money");
  }
  res.status(200).json(money);
});

// @desc update money balance
// @route PUT /inventory/money
// @access Private
const updateMoney = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const money = req.body.money;
  console.log(money);
  if (!user) [res.status(400).json({ message: "Nutzer nicht gefunden" })];
  console.log(req.body);
  user.money = req.body;
  const updated = await User.findByIdAndUpdate(
    req.user.id,
    { $set: { money: money } },
    { new: true }
  );
  if (!updated) {
    res.status(400).json({ message: "Dein Geldbalance wurde nicht geändert" });
  }
  res.status(200).json(updated.money);
});

const addToInventory = asyncHandler(async (req, res) => {
  if (!req.body.id) {
    res.status(400).json({ message: "Kein Id des Items vorhanden" });
  }
  console.log("attempting to add item");
  console.log(req.body.id);
  const item = await Item.findById(req.body.id);
  if (!item) {
    res.status(400).json({ message: "Item nicht gefunden" });
  }
  const inventory = await Inventory.create({
    item: item._id,
    amount: 1,
    status: req.user.name,
  });
  if (!inventory) {
    res
      .status(400)
      .json({ message: "Erstellen neues Inventory Items fehlgeschlagen" });
  }
  if (item.type === "roh") {
    const created = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { inventory: inventory } },
      { new: true }
    ).populate({
      path: "inventory.item",
      model: "Item",
    });
    if (!created) {
      const removeInv = await Inventory.findByIdAndDelete(inventory._id);
      res
        .status(400)
        .json({ message: "Hinzufgen des Inventories fehlgeschlagen" });
    }

    const newElement = created.inventory.find(
      (el) => el._id.toString() === inventory._id.toString()
    );
    res.status(200).json({ data: newElement });
  } else {
    const created = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { inventory: inventory } },
      { new: true }
    ).populate({
      path: "inventory.item",
      model: "Item",
      populate: {
        path: "material.element",
        model: "Item",
        select: "name",
      },
    });
    if (!created) {
      const removeInv = await Inventory.findByIdAndDelete(inventory._id);
      res
        .status(400)
        .json({ message: "Hinzufgen des Inventories fehlgeschlagen" });
    }

    const newElement = created.inventory.find(
      (el) => el._id.toString() === inventory._id.toString()
    );
    console.log(newElement);
    res.status(200).json(newElement);
  }
});

// @desc Remove item from users inventory
// @route DELETE /inventory/:id
// @access Private
const removeFromInventory = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400);
    throw new Error("Bitte überprüfe deine Eingabe!");
  }
  const removed = await User.findOneAndUpdate(
    {
      user: req.user.id,
      "inventory._id": req.params.id,
    },
    {
      $pull: {
        inventory: { _id: req.params.id },
      },
    },
    { new: true }
  );
  if (!removed) {
    res.status(400);
    throw new Error("Removed geht nicht!", req.params.id);
  }
  // remove from Inventory Model
  const removedFromDB = await Inventory.findByIdAndDelete(req.params.id);
  if (!removedFromDB) {
    console.log("Inventory nicht gelöscht");
  }
  res.status(200).json(req.params.id);
});

// @desc Remove item from users inventory
// @route PUT /inventory/split/:id
// @access Private
const splitAmount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(500).json({ message: "Spieler nicht gefunden" });
  }
  const { amount, id: inventoryId } = req.body;
  if (!amount || !inventoryId) {
    return res.status(500).json({ message: "Anzahl oder Item nicht gefunden" });
  }
  const oldItem = user.inventory.find(
    (el) => el._id.toString() === inventoryId.toString()
  );
  if (!oldItem) {
    return res.status(400).json({ message: "Item nicht gefunden" });
  }
  const itemId = oldItem.item._id;
  const newAmount = oldItem.amount - parseInt(amount);
  if (newAmount < 0) {
    return res.status(400).json({
      message:
        "Anzahl der gesplitteten Elementen soll weniger als Anzahl des Items sein",
    });
  }
  const updated = await User.findOneAndUpdate(
    { user: req.user.id, "inventory._id": inventoryId },
    { $inc: { "inventory.$.amount": -parseInt(amount) } },
    { new: true }
  ).populate({
    path: "inventory.item",
    model: "Item",
  });
  if (!updated) {
    return res.status(400).json({ message: "Altes Item wurde nicht geändert" });
  }
  const splittedItem = await Inventory.create({
    item: itemId,
    amount: parseInt(amount),
    status: req.user.name,
  });
  const created = await User.findByIdAndUpdate(
    req.user.id,
    { $push: { inventory: splittedItem } },
    { new: true }
  ).populate({
    path: "inventory.item",
    model: "Item",
  });
  if (!created || !splittedItem) {
    return res
      .status(400)
      .json({ message: "Gesplittetes Item wurde nicht geändert" });
  }
  const updatedItem = updated.inventory.find(
    (el) => el._id.toString() === inventoryId.toString()
  );
  const newItem = created.inventory.find(
    (el) => el._id.toString() === splittedItem._id.toString()
  );
  res.status(200).json({ updatedItem: updatedItem, newItem: newItem });
});

// @desc Post iventory item to other user
// @route POST /inventory/share
// @access Private
const shareWith = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(500).json({ message: "Spieler nicht gefunden" });
  }
  const { uid, inv } = req.body;
  console.log(uid, inv);
  console.log(uid, mongoose.Types.ObjectId(uid));
  const userToShare = await User.findById(uid);
  console.log("give item to: ", userToShare?.name);
  const userInv = user.inventory;
  const itemToRemove = userInv.find((el) => el._id.toString() === inv);
  const amountToGive = itemToRemove.amount;
  const itemToGive = itemToRemove.item;
  if (userToShare) {
    // remove the item from users inventory
    const inventoryItem = await User.findByIdAndUpdate(
      {
        _id: req.user.id,
        "inventory._id": inv,
      },
      {
        $pull: {
          inventory: { _id: inv },
        },
      }
    );
    if (!inventoryItem) {
      console.log(inventoryItem);
      res
        .status(400)
        .json({ message: "Inventory Item konnte man nicht entfernen" });
    } else {
      const newInv = await Inventory.create({
        item: itemToGive,
        amount: amountToGive,
        status: userToShare.name,
      });
      if (!newInv) {
        res
          .status(400)
          .json({ message: "Inventar DB könnte nicht erstellt werden" });
      }
      const getterUser = await User.findByIdAndUpdate(
        userToShare._id,
        { $push: { inventory: newInv } },
        { new: true }
      );
      if (!getterUser) {
        res
          .status(400)
          .json({ message: "Das Element wurde nicht weitergeleitet" });
      }
      res.status(200).json(req.body.inv);
    }
  } else {
    res.status(400).json({ message: "Spieler zum Teilen nicht gefunden" });
  }
});

// @desc Get items of specific category
// @route POST /inventory/filter
// @access Private
const getCategorizedInventory = asyncHandler(async (req, res) => {
  console.log("hi");

  const user = await User.findById(req.user.id).populate({
    path: "inventory.item",
    model: "Item",
    populate: {
      path: "material.element",
      model: "Item",
    },
  });
  const category = req.params.category;
  console.log(category);
  //const category = req.body.category;
  if (!user) {
    res.status(500).json({ message: "Spieler nicht gefunden" });
  }
  if (!category) {
    res.status(500).json({ message: "Kategorie nicht eingegeben" });
  }
  const inventory = user.inventory;

  if (!inventory) {
    res.status(500).json({ message: "Kein Inventar vorhanden" });
  }
  const sorted = inventory.filter((el) => el.item?.category === category);
  if (sorted.length === 0) {
    res.status(200).json({
      found: false,
      items: sorted,
      message: "Keine Items in dieser Kategorie",
    });
  } else {
    res.status(200).json({
      found: true,
      items: sorted,
      message: "",
    });
  }
});

// @desc Get items of specific category
// @route GET /inventory/items
// @access Public
const getCategorizedItems = asyncHandler(async (req, res) => {
  const ctg = req.body.category;
  if (!ctg) {
    res.status(500).json({ message: "Kategorie nicht eingegeben" });
  }
  const item = await Item.find({ category: ctg }).populate({
    path: "material.element",
    model: "Item",
    select: "name",
  });
  if (!item) {
    res.status(400).json({ message: "Nichts gefunden" });
  }
  res.status(200).json({ data: item });
});
// @desc Equip item to the user - set status to equip & replace the item in the slot if needed
// @route PUT /inventory/equip
// @access Public
const equipItem = asyncHandler(async (req, res) => {
  const { invId } = req.body;
  const slotsPossible = [
    "Kopf",
    "Beine",
    "Hals",
    "Rücken",
    "Brust",
    "Füße",
    "Arme",
    "Hüfte",
    "Finger",
  ];
  const user = await User.findById(req.user.id)
    .populate({
      path: "inventory.item",
      model: "Item",
      populate: {
        path: "material.element",
        model: "Item",
      },
    })
    .populate({
      path: "userclass",
      select: "name category description abilities advantages",
      model: "Userclass",
    });
  if (!invId) {
    res.status(500).json({ message: "Id des Items nicht eingegeben" });
  }
  if (!user) {
    res.status(500).json({ message: "Spieler nicht gefunden" });
  }
  // get slot name from the item
  const inventory = user.inventory;
  const slot = inventory.find((el) => el._id.toString() === invId)?.item;
  const slotGenus = slot.genus;
  const slotCategory = slot.category;
  let replacedFlag = false; // slot item was replaced
  let toReplaceId = ""; // old item from the taken slot
  let equipmentAllowed = false; // new item is allowed for equipment
  let additionalId = ""; // replacement of the additional item needed
  let additionalReplaceFlag = false;
  console.log(slotGenus, slotCategory);
  const weaponsEquipped = inventory.filter(
    (el) => el.status === "Ausgerüstet" && el.item.category === "Waffe"
  );
  const uclass = user.userclass?.name;
  console.log(user.userclass);
  if (slotCategory === "Waffe") {
    //check shield is equipped
    const shieldEquipped = inventory.find(
      (el) =>
        el.status === "Ausgerüstet" &&
        el.item.category === "Rüstung" &&
        el.item.genus === "Schild"
    );
    // nothing is equipped in this category
    const onehand = slot.type === "einhändig" ? true : false;
    if (weaponsEquipped.length > 0) {
      // some weapons are already in use
      if (shieldEquipped) {
        // shield and weapon equipped
        if (onehand) {
          //replace the old weapon with the new one
          replacedFlag = true;
          toReplaceId = weaponsEquipped[0]._id;
          equipmentAllowed = true;
          console.log("Ersetzen alter Waffe mit neuen. Schild ist ausgerüstet");
        } else {
          // the new weapon is 2hand
          if (uclass === "Schildwache") {
            // can equip a twohander to shield
            // replace old weapon
            replacedFlag = true;
            toReplaceId = weaponsEquipped[0]._id;
            equipmentAllowed = true;
            console.log(
              "Schildwache. Ersetzen alter Waffe mit zweihand. Schild ist ausgerüstet"
            );
          } else {
            // replace the weapon with the new one
            replacedFlag = true;
            toReplaceId = weaponsEquipped[0]._id;
            // + unequip shield
            additionalReplaceFlag = true;
            additionalId = shieldEquipped._id;
            equipmentAllowed = true;
            console.log("Nicht Schildwache. Ersetzen das Schild und die Waffe");
          }
        }
      } else {
        // no shield, only weapons are equipped
        if (onehand) {
          console.log(uclass);
          if (uclass === "Assassine" || uclass === "Waffenmeister") {
            //can equip two 1hand weapons
            if (weaponsEquipped.length === 1) {
              // add the second 1hand
              replacedFlag = false;
              equipmentAllowed = true;
              console.log(
                "Assa oder WM. Zweite einhand wird ausgerüstet. Kein Schild"
              );
            } else {
              // replace the first weapon with the new one
              replacedFlag = true;
              toReplaceId = weaponsEquipped[0]._id;
              equipmentAllowed = true;
              console.log(
                "Assa oder WM. Zwei Waffen sind bereits ausgerüstet. Erste wird ersetzt. Kein Schild"
              );
            }
          } else {
            // replace onehand weapon
            replacedFlag = true;
            toReplaceId = weaponsEquipped[0]._id;
            equipmentAllowed = true;
            console.log(
              "Neue 1hand erasetzt die alte. Kein Schild, nicht Assa. "
            );
          }
        } else {
          // new twohand weapon
          if (weaponsEquipped.length === 1) {
            //replace the old one with new 2hand
            replacedFlag = true;
            toReplaceId = weaponsEquipped[0]._id;
            equipmentAllowed = true;
            console.log("Ersetzen alter Waffe mit neuen 2hand. kein Schild");
          } else {
            // replace both weapons with 2hand
            replacedFlag = true;
            toReplaceId = weaponsEquipped[0]._id;
            equipmentAllowed = true;
            additionalReplaceFlag = true;
            additionalId = weaponsEquipped[1]._id;
            console.log("Ersetzen beider Waffen mit neuen 2hand. kein Schild");
          }
        }
      }
    } else {
      // no weapons
      if (shieldEquipped) {
        // no weapons but shield
        if (onehand) {
          // equip onehand item to shield
          replacedFlag = false;
          equipmentAllowed = true;
          console.log("1hand hinzufügen. keine Waffe, aber Schild");
        } else {
          if (uclass === "Schildwache") {
            // equip 2hand to shield
            replacedFlag = false;
            equipmentAllowed = true;
            console.log(
              "Schildwache. 2hand zu Schild hinzufügen. keine Waffe, aber Schild"
            );
          } else {
            // replace shield with 2hand weapon
            replacedFlag = true;
            toReplaceId = shieldEquipped._id;
            equipmentAllowed = true;
            console.log(
              "Schild durch 2hand ersetzen. keine Waffen, aber Schild"
            );
          }
        }
      } else {
        // no shield no weapons
        replacedFlag = false;
        equipmentAllowed = true;
        console.log("Neue Waffe hinzufügen. kein Schild, keine Waffen");
      }
    }
  } else if (
    slotCategory === "Rüstung" &&
    slotsPossible.indexOf(slotGenus) >= 0
  ) {
    //check if the there is already smth in the slot
    const slotTaken = inventory.find(
      (el) =>
        el.status === "Ausgerüstet" &&
        el.item.category === slotCategory &&
        el.item.genus === slotGenus
    );
    console.log("Slots taken by armor", slotTaken);
    if (slotTaken) {
      // unequip slot first
      replacedFlag = true;
      toReplaceId = slotTaken._id;
      equipmentAllowed = true;
      console.log("Ersetzen alter Rüstung");
    } else {
      console.log("frei");
      replacedFlag = false;
      equipmentAllowed = true;
      console.log("Hinzufügen neuer Rüstung ins Slot ", slotGenus);
    }
  } else if (slotGenus === "Schild") {
    // Shield can be combined with one hand weapon or with 2hand weapon as shieldmaster
    const slotTaken = inventory.find(
      (el) =>
        el.status === "Ausgerüstet" &&
        el.item.category === slotCategory &&
        el.item.genus === slotGenus
    );
    if (slotTaken) {
      replacedFlag = true;
      toReplaceId = slotTaken._id;
      equipmentAllowed = true;
      console.log("Schild ersetzen");
    } else {
      // first try to equip a shield
      // weapons equipped check
      if (weaponsEquipped.length > 0) {
        //check if there is a 2handed weapon equipped
        const twohand = weaponsEquipped.find(
          (el) => el.item.type === "zweihändig"
        );
        if (twohand) {
          // replace the weapon and equip a shield instead
          if (uclass === "Schildwache") {
            // can equip shield with 2hand
            equipmentAllowed = true;
            console.log("Hinzufügen neue 2hand zu Schild");
          } else {
            // replace 2hand weapon with a shield
            replacedFlag = true;
            toReplaceId = twohand._id;
            equipmentAllowed = true;
            console.log("Ersetzen alter Waffe MIT Schild");
          }
        } else {
          if (weaponsEquipped.length === 1) {
            // there is only 1 onehand weapon equipped, so shield slot is empty
            replacedFlag = false;
            equipmentAllowed = true;
            console.log("1habd ist ausgerüstet, Schild hinzugefügt.");
          } else {
            // two 1hand weapons, replace the second with shield
            replacedFlag = true;
            toReplaceId = weaponsEquipped[weaponsEquipped?.length - 1]?._id;
            equipmentAllowed = true;
            console.log("Ersetzen zweiter Waffe mit Shild.");
          }
        }
      } else {
        // no weapons equipped, no checks needed
        replacedFlag = false;
        equipmentAllowed = true;
        console.log("Keine Waffen. Schild hinzufügen");
      }
    }
  } else {
    res
      .status(500)
      .json({ message: "Falsche Kategorie. Waffe oder Rüstung sind passend" });
  }
  if (equipmentAllowed) {
    const userName = user.name;
    let replacedItem = {};
    if (replacedFlag) {
      // additionaly reequip the old item
      const replaced = await User.findOneAndUpdate(
        {
          user: req.user.id,
          "inventory._id": toReplaceId,
        },
        {
          $set: {
            "inventory.$.status": userName,
          },
        },
        { new: true }
      ).populate({
        path: "inventory.item",
        model: "Item",
        populate: {
          path: "material.element",
          model: "Item",
        },
      });
      if (!replaced) {
        res.status(400).json({
          message: `Slot: ${slotGenus}  ist bereits belegt! Das Ersetzen hat nicht funktioniert`,
        });
      }
      // extract the replaced item
      replacedItem = replaced.inventory.find(
        (el) => el._id.toString() === toReplaceId._id.toString()
      );
    }
    const updated = await User.findOneAndUpdate(
      {
        user: req.user.id,
        "inventory._id": invId,
      },
      {
        $set: {
          "inventory.$.status": "Ausgerüstet",
        },
      },
      { new: true }
    ).populate({
      path: "inventory.item",
      model: "Item",
      populate: {
        path: "material.element",
        model: "Item",
      },
    });
    if (!updated) {
      res.status(400).json({ message: `Ausrüsten hat nicht funktioniert` });
    }
    const updatedItem = updated.inventory.find(
      (el) => el._id.toString() === invId
    );
    if (additionalReplaceFlag) {
      // the second item into old data
      const additionalReplacement = await User.findOneAndUpdate(
        {
          user: req.user.id,
          "inventory._id": additionalId,
        },
        {
          $set: {
            "inventory.$.status": userName,
          },
        },
        { new: true }
      ).populate({
        path: "inventory.item",
        model: "Item",
        populate: {
          path: "material.element",
          model: "Item",
        },
      });
      if (!additionalReplacement) {
        res
          .status(400)
          .json({ message: `Abrüsten des Schildes hat nicht funktioniert` });
      }
      const additional = additionalReplacement.inventory.find(
        (el) => el._id.toString() === additionalId.toString()
      );
      res.status(200).json({
        replaced: replacedFlag,
        //old: [replacedItem, additional],
        unequipItem: replacedItem,
        additionalUnequiup: additional,
        updated: updatedItem,
      });
    } else {
      res.status(200).json({
        replaced: replacedFlag,
        unequipItem: replacedItem,
        additionalUnequiup: null,
        // old: [replacedItem],
        updated: updatedItem,
      });
    }
  }
});
// @desc Unequip item  - set status to user.name
// @route PUT /inventory/unequip
// @access Public
const unequipItem = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const user = await User.findById(req.user.id).populate({
    path: "inventory.item",
    model: "Item",
    populate: {
      path: "material.element",
      model: "Item",
    },
  });
  const uname = user?.name;
  if (!uname || !id) {
    res.status(400).json({ error: "Parameter sind falsch" });
  }
  updated = await User.findOneAndUpdate(
    {
      user: req.user.id,
      "inventory._id": id,
    },
    {
      $set: {
        "inventory.$.status": uname,
      },
    },
    { new: true }
  ).populate({
    path: "inventory.item",
    model: "Item",
    populate: {
      path: "material.element",
      model: "Item",
    },
  });
  if (!updated) {
    res.status(400).json({ error: "Das Update ist fehlgeschlagen" });
  } else {
    res.status(200).json({ id, uname });
  }
});
module.exports = {
  getInventory,
  getWeapons,
  getMoney,
  getArmor,
  getLoadCapacity,
  updateMoney,
  putAmount,
  substractAmount,
  toInventory,
  addToInventory,
  removeFromInventory,
  getCategorizedInventory,
  getCategorizedItems,
  equipItem,
  unequipItem,
  splitAmount,
  shareWith,
};
