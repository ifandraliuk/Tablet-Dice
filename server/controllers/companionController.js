const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Companion = require("../models/companionModel");
const Bestiarium = require("../models/bestiariumModel");
const Item = require("../models/itemsModel");

/* COMPANIONS */

// @desc get user companions
// @route GET /companion
// @access Private
const getCompanion = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate({ path: "companions.creature", model: "Bestiarium" })
    .populate({ path: "companions.slot1", model: "Item" })
    .populate({ path: "companions.slot2", model: "Item" });
  if (!user) {
    res.status(500).json({ message: "Spieler nicht gefunden" });
  }
  const companions = user.companions ? user.companions : [];
  res.status(200).json(companions);
});

// @desc get slots allowed for the user dep. on the charisma points
// @route GET /companion/slots
// @access Private

const getSlotsAvailable = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(500).json({ message: "Spieler nicht gefunden" });
  }
  const charismaPoints = user.attributes ? user.attributes.charisma : 0;
  const slotsAllowed =
    charismaPoints >= 1 && charismaPoints < 5
      ? 1
      : charismaPoints >= 5 && charismaPoints < 10
      ? 2
      : charismaPoints >= 10 && charismaPoints < 15
      ? 3
      : charismaPoints >= 15 && charismaPoints < 20
      ? 4
      : charismaPoints >= 20
      ? 5
      : 0;
  res.status(200).json(slotsAllowed);
});

// @desc get slots allowed for the user dep. on the charisma points
// @route GET /companion/equipable
// @access Private

const getEquipable = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate({
    path: "inventory.item",
    model: "Item",
    populate: {
      path: "material.element",
      model: "Item",
    },
  });

  if (!user || !user.inventory) {
    res.status(500).json({ message: "Spieler nicht gefunden" });
  }
  const companionItems = user.inventory.filter((el) => el.item.category === "Begleiter")
  console.log(companionItems)
  res.status(200).json(companionItems);
});

// @desc post new creature to users companions
// @route POST /companion
// @access Private

const addCompanion = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(500).json({ message: "Spieler nicht gefunden" });
  }
  const creature = await Bestiarium.findById(req.body.id);
  if (!creature) {
    res.status(500).json({ message: "Kreatur nicht gefunden" });
  }
  const companion = await Companion.create({
    creature: creature._id,
    name: req.body.name.length > 0 ? req.body.name : "Otto",
    level: 1,
    status: "Stall",
    inventory: null,
    slot1: null,
    slot2: null,
  });
  const created = await User.findByIdAndUpdate(
    req.user.id,
    { $push: { companions: companion } },
    { new: true }
  );
  if (!created) {
    res.status(400);
    throw new Error("Kreatur konnte nicht hinzugefügt werden...");
  }
  console.log("Kreatur wurde erstellt und hinzgefügt");
  res.status(200).json(companion);
});

// @desc update companions status usage
// @route PUT /companion/:id
// @access Private
const updateStatus = asyncHandler(async (req, res) => {
  console.log(req.body.id, req.body.status);
  const user = await User.findById(req.user.id);
  const slots = [
    "Schulterpet",
    "Reittier",
    "Begleiter 1",
    "Begleiter 2",
    "Drache",
    "Stall",
  ];
  if (!user) {
    res.status(500).json({ message: "Spieler nicht gefunden" });
  }
  if (!req.body.id) {
    res.status(400).json({ message: "Kreatur wurde nicht eingegeben" });
  }
  if (!req.body.status || slots.findIndex((el) => el === req.body.status) < 0) {
    res
      .status(400)
      .json({ message: "Neuer Status wurde nicht eingegeben oder ist falsch" });
  }
  const updated = await User.findOneAndUpdate(
    {
      _id: req.user.id,
      //'talents.talent': talent._id
      "companions._id": req.body.id,
    },
    {
      $set: {
        "companions.$.status": req.body.status,
      },
    },
    { new: true }
  ).populate({ path: "companions.creature", model: "Bestiarium" });
  if (!updated) {
    res.status(400).json({ message: "Status konnte nicht updated werden" });
  }
  const companions = updated.companions;
  console.log(companions);
  const updatedId = companions.findIndex(
    (el) => el._id.toString() === req.body.id
  );
  console.log(updatedId);
  res.status(200).json({ id: req.body.id, updated: companions[updatedId] });
});

// @desc update companions equipment slots
// @route PUT /companion/equip/
// @access Private
const equipToCompanion = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const item = await Item.findById(req.body.itemId);
  const companion = user.companions.find(
    (el) => el._id.toString() === req.body.id
  );
  console.log(req.body);
  console.log(user.companions[1]._id.toString(), req.body.id);
  if (!user) {
    res.status(500).json({ message: "Spieler nicht gefunden" });
  }
  if (!item) {
    res.status(500).json({ message: "Item nicht gefunden" });
  }
  if (!companion) {
    res.status(500).json({ message: "Companion nicht gefunden" });
  }
  if (!req.body.id) {
    res.status(500).json({ message: "Id des Companions nicht vorgegeben" });
  }
  if (!req.body.genus) {
    res.status(500).json({ message: "Gattung des Items ist leer" });
  }
  if (!req.body.itemId) {
    res.status(500).json({ message: "Id des Items nicht vorgegeben" });
  }
  if (req.body.genus === "Sattel") {
    console.log("Sattel!");
    const updated = await User.findOneAndUpdate(
      {
        _id: req.user.id,
        "companions._id": companion._id,
      },
      {
        $set: {
          "companions.$.slot1": item._id,
        },
      },
      { new: true }
    )
      .populate({ path: "companions.creature", model: "Bestiarium" })
      .populate({
        path: "companions.slot1",
        model: "Item",
        select: "_id genus name category rarity bonuses weight",
      });
    if (!updated) {
      res.status(400).json({ message: "Update fehlgeschlagen" });
    }
    const companions = updated.companions;
    console.log(companions);
    const updatedId = companions.findIndex(
      (el) => el._id.toString() === req.body.id
    );
    console.log(updatedId);
    res.status(200).json({ id: req.body.id, updated: companions[updatedId] });
  } else {
    const updated = await User.findOneAndUpdate(
      {
        _id: req.user.id,
        "companions._id": req.body.id,
      },
      {
        $set: {
          "companions.$.slot2": req.body.itemId,
        },
      },
      { new: true }
    )
      .populate({ path: "companions.creature", model: "Bestiarium" })
      .populate({
        path: "companions.slot2",
        model: "Item",
        select: "_id genus name category rarity bonuses weight",
      });
    if (!updated) {
      res.status(400).json({ message: "Update fehlgeschlagen" });
    }
    const companions = updated.companions;
    console.log(companions);
    const updatedId = companions.findIndex(
      (el) => el._id.toString() === req.body.id
    );
    console.log(updatedId);
    res.status(200).json({ id: req.body.id, updated: companions[updatedId] });
  }
});

// @desc update money balance
// @route PUT /companion/item
// @access Private
const removeItemCompanion = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const companion = user.companions.find(
    (el) => el._id.toString() === req.body.id
  );
  console.log(req.body, req.user.id);
  console.log("comp: ", companion);
  if (!user) {
    res.status(500).json({ message: "Spieler nicht gefunden" });
  }
  if (!companion) {
    res.status(500).json({ message: "Begleiter nicht gefunden" });
  }
  if (req.body.slotName === "slot1") {
    const removed = await User.findOneAndUpdate(
      {
        _id: req.user.id,
        "companions._id": companion._id,
      },
      {
        $set: {
          "companions.$.slot1": null,
        },
      },
      { new: true }
    );
    if (!removed) {
      res.status(400).json({ message: "Löschen hat nicht funktioniert" });
    }
    res
      .status(200)
      .json({ slotName: req.body.slotName, companion: companion._id });
  } else {
    const removed = await User.findOneAndUpdate(
      {
        _id: req.user.id,
        "companions._id": companion._id,
      },
      {
        $set: {
          "companions.$.slot2": null,
        },
      },
      { new: true }
    );
    if (!removed) {
      res.status(400).json({ message: "Löschen hat nicht funktioniert" });
    }
    res
      .status(200)
      .json({ slotName: req.body.slotName, companion: companion._id });
  }
});
// @desc update money balance
// @route PUT /player/balance
// @access Private
const updateBalance = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) [res.status(400).json({ message: "Nutzer nicht gefunden" })];
  console.log(req.body);
  user.money = req.body;
  const doc = await user.save();
  if (!doc) {
    res.status(400).json({ message: "Dein Geldbalance wurde nicht geändert" });
  }
  res.status(200).json(doc.money);
});

module.exports = {
  addCompanion,
  getCompanion,
  getSlotsAvailable,
  getEquipable,
  updateStatus,
  equipToCompanion,
  removeItemCompanion,
};
