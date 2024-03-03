const asyncHandler = require("express-async-handler");
const Talent = require("../models/talentModel");
const User = require("../models/userModel");

const getTalent = asyncHandler(async (req, res) => {
  const talents = await Talent.find();
  res.status(200).json(talents);
});

const getPlayerTalent = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate({
    path: "talents.talent",
    model: "Talent",
    select: "_id category name dice",
  })
  console.log(user.talent)
  const talents = user?.talents;
  res.status(200).json(talents);
});

const setTalent = asyncHandler(async (req, res) => {
  if (!req.body.name) {
    res.status(400);
    throw new Error("Falsch! Das Feld darf nicht leer sein");
  }

  const talent = await Talent.create({
    category: req.body.category,
    name: req.body.name,
    dice: req.body.dice,
  });
  res.status(200).json(talent);
});

const updateTalent = asyncHandler(async (req, res) => {
  const talent = await Talent.findById(req.params.id);
  if (!talent) {
    res.status(400);
    throw new Error("Der Talent wurde nicht gefunden");
  }
  if (!req.user) {
    res.status(401);
  }
  // Logged in user matches talent user
  if (talent.user.toString() !== req.user.id) {
    res.status(401);
  }
  const toUpdate = await Talent.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!toUpdate) {
    res.status(400);
  }
  res.status(200).json(toUpdate);
});

const deleteTalent = asyncHandler(async (req, res) => {
  const talent = await Talent.findById(req.params.id);
  if (!talent) {
    res.status(400);
    throw new Error("Der Talent wurde nicht gefunden");
  }

  await talent.remove();
  res.status(200).json({ id: req.params.id });
});

/** Player talents */
const addUserTalent = asyncHandler(async (req, res) => {
  console.log(req.body.point, req.body.name);
  if (!req.body.point || !req.body.name) {
    res.status(400);
    throw new Error("Bitte überprüfe deine Eingabe!");
  }
  const talent = await Talent.findOne({ name: req.body.name });
  if (!talent) {
    res.status(400);
    throw new Error("Talent nicht gefunden...");
  }
  console.log("Neues talent:", req.body.name);
  const utalent = await UserTalents.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId() },
    {
      talent: talent._id,
      points: req.body.point,
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
      populate: {
        path: "talent",
        model: "Talent",
        select: "_id category name dice",
      },
    }
  );
  console.log(utalent);
  if (!utalent) {
    res.status(400);
    throw new Error("Talent konnte nicht erstellt werden...");
  }
  const created = await User.findByIdAndUpdate(
    req.user.id,
    { $push: { talents: utalent } },
    { new: true }
  );
  if (!created) {
    res.status(400);
    throw new Error("Talent konnte nicht erstellt werden...");
  }
  console.log("Talent wurde erstellt und hinzgefügt");
  res.status(200).json(utalent);
});

const putUserTalent = asyncHandler(async (req, res) => {
  console.log(req.body.point, req.body.id);
  if (!req.body.point || !req.body.id) {
    res.status(400);
    throw new Error("Bitte überprüfe deine Eingabe!");
  }
  //const talent = await Talent.findById(req.body.id)
  const talent = await UserTalents.findByIdAndUpdate(
    req.body.id,
    { points: req.body.point },
    { new: true }
  ).populate({
    path: "talent",
    model: "Talent",
    select: "_id category name dice",
  });
  const user = await User.findById(req.user.id);
  console.log(talent);
  if (!talent) {
    res.status(500);
    throw new Error("Talent nicht gefunden...");
  }
  const updated = await User.findOneAndUpdate(
    {
      user: req.user.id,
      //'talents.talent': talent._id
      "talents._id": talent._id,
    },
    {
      $set: {
        "talents.$": talent,
      },
    },
    { new: true }
  ).populate({
    path: "talents.talent",
    model: "Talent",
    select: "_id category name dice",
  });
  if (!updated) {
    res
      .status(400)
      .json({ message: "Es war unmöglich, diesen Talent zu updaten" });
  }
  res.status(200).json(talent);
});

// @desc Remove a talent from users inventory
// @route DELETE /player/talents/:id
// @access Private
const removeUserTalent = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400);
    throw new Error("Bitte überprüfe deine Eingabe!");
  }
  const talent = await UserTalents.findById(req.params.id);
  console.log(talent);
  await talent.remove();
  const u = await User.findById(req.user.id);
  const removed = await User.findByIdAndUpdate(
    {
      _id: u._id,
      "talents._id": req.params.id,
    },
    {
      $pull: {
        talents: { _id: req.params.id },
      },
    },
    { new: true }
  );

  if (!removed) {
    res.status(400).json({ message: "Das Löschen hat nicht geklappt!" });
    throw new Error("Talent konnte nicht erstellt werden...");
  }
  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getTalent,
  getPlayerTalent,
  setTalent,
  updateTalent,
  deleteTalent,
  addUserTalent,
  removeUserTalent,
  putUserTalent,
};
