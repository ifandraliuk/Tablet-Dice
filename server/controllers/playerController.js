const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Userclass = require("../models/classesModel");
const Attribute = require("../models/attributesModel");
const General = require("../models/generalModel");
const mongoose = require("mongoose");

// @desc Get user data
// @route GET /users/player
// @access Private
const getPlayer = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate({
      path: "userclass",
      select: "name category description abilities advantages",
      model: "Userclass",
    })
    .populate({
      path: "talents.talent",
      model: "Talent",
      select: "_id category name dice",
    })
    .populate({ path: "inventory.item", model: "Item" })
    .populate({
      path: "inventory.item.material.element",
      model: "Item",
      select: "_id name",
    })
    .populate({ path: "companions.creature", model: "Bestiarium" })
    .populate({ path: "companions.slot1", model: "Item", select: "_id genus name category rarity bonuses weight value" })
    .populate({ path: "companions.slot2", model: "Item", select: "_id genus name category rarity bonuses weight value" });
  //console.log(user.userclass.name)
  if (!user) {
    res.status(500).json({ message: "Spieler nicht gefunden" });
  }
  res.status(200).json(user);
});


// @desc get level
// @route GET /player/level
// @access Private

const getLevel = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user || !user?.level || !user?.pointsLeft) {
    res.status(500).json({ message: "Spieler nicht gefunden" });
  }

  res.status(200).json({ level: user.level, pointsLeft: user.pointsLeft });
});


// @desc level up a character
// @route PUT /player/level
// @access Private

const updateLevel = asyncHandler(async (req, res) => {
  try {
    // Find the user by ID and increment the level
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { level: 1 } }, 
      { new: true } // Return the updated document
    );

    // If user not found, return an error response
    if (!updatedUser) {
      return res.status(500).json({ message: "Spieler nicht gefunden" });
    }

    // Check if the user's level is a multiple of 5
    if (updatedUser.level % 5 === 0) {
      console.log("1 Attributespunkt freigeschaltet!");
      // If yes, increment pointsLeft by 1
      await updatedUser.updateOne({ $inc: { pointsLeft: 1 } });
    }

    // Return the updated user information in the response
    res.status(200).json({ level: updatedUser.level, pointsLeft: updatedUser.pointsLeft });
  } catch (error) {
    // Handle unexpected errors
    console.error("Error in getLevel:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// @desc Add infos to a new character
// @route PUT /player/create
// @access Private
const createCharacter = asyncHandler(async (req, res) => {
  console.log("uploading data to a new character");
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(500).json({ message: "Spieler nicht gefunden" });
  }
  // adding default level 1 && 70 attribute points
  console.log(req.body);
  console.log(req.body.attributes);
  user.level = 1;
  user.pointsLeft = 70;
  user.money = [0, 0, 0];
  //adding userclass
  if (!req.body.userclass) {
    res.status(400).json({ message: "Bitte wähle eine Spezialisation" });
  }
  const userclass = await Userclass.findOne({ name: req.body.userclass });
  if (!userclass) {
    res
      .status(500)
      .json({ message: "Gewählte Spezialisation wurde nicht gefunden" });
  }
  user.userclass = userclass._id;
  // adding general info
  if (!req.body.kind) {
    res
      .status(400)
      .json({ message: "Bitte wähle die Specie deines Charakters aus" });
  }
  const gen = await General.create({
    kind: req.body.kind,
    age: req.body.age,
    haircolor: req.body.haircolor,
    sex: req.body.sex,
    eyecolor: req.body.eyecolor,
    origin: req.body.origin,
    more: req.body.more,
    haircut: req.body.haircut,
  });
  if (!gen) {
    res
      .status(400)
      .json({ message: "Die Werte aus dem Schritt 4 sind unvollständig" });
  }
  user.general = gen;
  // adding attributes
  const attr = await Attribute.create(req.body.attributes);
  if (!attr) {
    res
      .status(400)
      .json({
        message:
          "Die Werte aus dem Schritt 5 sind nicht korrekt. Vitalität eingegeben?",
      });
  }
  user.attributes = attr;
  const doc = await user.save();
  if (!doc) {
    res.status(400).json({ message: "Charaktererstellung hat fehlgeschlagen" });
  }
  res.status(200).json(doc);
});

const uploadPicture = asyncHandler(async (req, res) => {
  console.log("backend picture upload");
  const image = req.files.img;
  //const filename = req.files[1]
  console.log(image, image.name);
  const path = "./../client/public/user/" + image.name;
  image.mv(path, (error) => {
    if (error) {
      console.error(error);
      res.writeHead(500, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify({ status: "error", message: error }));
      return;
    }

    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify({ status: "success", path: "/user/" + image.name }));
  });
});



const setEnchantment = asyncHandler(async (req, res) => {
  console.log(req.body);
  console.log(req.user.id);
  if (!req.body.id) {
    res.status(400).json({ message: "nicht autorisiert für die Verzauberung" });
    throw new Error("Nicht autorisuert!");
  }
  if (!req.body.id || !req.body.rarity || !req.body.bonuses) {
    res.status(400).json({ message: "überprüfe deine Eingabe" });
    throw new Error("überprüfe deine Eingabe");
  }
  const enchantment = { rarity: req.body.rarity, bonuses: req.body.bonuses };
  const enchanted = await User.findOneAndUpdate(
    {
      user: req.user.id,
      "inventory._id": req.body.id,
    },
    {
      $set: {
        "inventory.$.enchantment": enchantment,
      },
    },
    { new: true }
  ).populate({
    path: "inventory.item",
    model: "Item",
    select:
      "_id name category price bonuses value weight rarity genus dice material type",
  });
  if (!enchanted) {
    res.status(400).json({ message: "Verzaubern fehlgeschlagen" });
    throw new Error("Verzaubern geht nicht!", req.body.id);
  }
  console.log(enchanted.inventory);
  res.status(200).json(enchanted.inventory);
});

module.exports = {
  getPlayer,
  createCharacter,
  getLevel,
  updateLevel,
  //updateBalance,
  setEnchantment,
  uploadPicture,

};
