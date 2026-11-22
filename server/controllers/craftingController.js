const mongoose = require("mongoose");
const User = require("../models/userModel");
const Item = require("../models/itemsModel");
const Talent = require("../models/talentModel");
const Inventory = require("../models/inventoryModel");
const UserTalents = require("../models/userTalentsModel");
const CraftingOperation = require("../models/craftingOperationModel");
const stations = require("../../client/src/pages/Crafting/stations.json");

class CraftingError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function performCraft({ userId, recipeId, profession, outcome, operationId }) {
  await CraftingOperation.init();
  const session = await mongoose.startSession();
  let result;
  try {
    await session.withTransaction(async () => {
      const previous = await CraftingOperation.findById(operationId).session(session);
      if (previous) {
        if (String(previous.user) !== String(userId) || String(previous.recipe) !== recipeId ||
            previous.profession !== profession || previous.outcome !== outcome) {
          throw new CraftingError(409, "Diese Herstellungsanfrage wurde bereits anders verwendet.");
        }
        result = previous.result;
        return;
      }

      const user = await User.findById(userId).session(session);
      const recipe = await Item.findById(recipeId).session(session);
      const talent = await Talent.findOne({ category: "Handwerk", name: profession }).session(session);
      if (!user || !recipe || !talent) throw new CraftingError(404, "Charakter, Rezept oder Beruf nicht gefunden.");

      const levels = stations.professions[profession];
      const level = levels.findIndex((values) => values.includes(recipe.production));
      if (level < 0) throw new CraftingError(400, "Dieses Rezept gehört nicht zu diesem Beruf.");
      const entries = user.talents.filter((entry) => String(entry.talent) === String(talent._id));
      if (entries.length > 1) throw new CraftingError(409, "Das Berufstalent ist mehrfach vorhanden. Bitte wende dich an die Spielleitung.");
      const points = entries.length ? entries[0].points : 0;
      if (!Number.isSafeInteger(points) || points < 0) throw new CraftingError(409, "Die Talentpunkte sind ungültig.");
      if (level > 0 && points < stations.thresholds[level]) throw new CraftingError(409, `Dieser Herstellungsort benötigt ${stations.thresholds[level]} Talentpunkte.`);

      if (!recipe.material.length) throw new CraftingError(409, "Die Materialangaben des Rezepts sind unvollständig.");
      const needed = new Map();
      for (const material of recipe.material) {
        if (!material.element || !Number.isFinite(material.amount) || material.amount <= 0) {
          throw new CraftingError(409, "Die Materialangaben des Rezepts sind unvollständig.");
        }
        const id = String(material.element);
        needed.set(id, (needed.get(id) || 0) + material.amount);
      }
      const changed = [];
      for (const [id, quantity] of needed) {
        const stacks = user.inventory.filter((entry) => String(entry.item) === id && entry.status === user.name && Number.isFinite(entry.amount) && entry.amount > 0);
        if (stacks.reduce((sum, entry) => sum + entry.amount, 0) < quantity) {
          throw new CraftingError(409, "Nicht genügend Materialien im eigenen Inventar. Bitte aktualisiere die Ansicht.");
        }
        let remaining = quantity;
        for (const entry of stacks) {
          if (remaining <= 0) break;
          const used = Math.min(remaining, entry.amount);
          entry.amount -= used;
          remaining -= used;
          changed.push(entry);
        }
      }

      for (const entry of changed) {
        if (entry.amount === 0) {
          await Inventory.deleteOne({ _id: entry._id }).session(session);
          user.inventory.id(entry._id).remove();
        } else {
          const { _id, ...fields } = entry.toObject();
          await Inventory.updateOne({ _id }, { $set: fields }, { upsert: true, session });
        }
      }
      if (outcome !== "criticalFailure") {
        const item = new Inventory({ item: recipe._id, amount: 1, status: user.name });
        await item.save({ session });
        user.inventory.push(item.toObject());
      }
      if (outcome === "criticalSuccess") {
        let entry = entries[0];
        if (!entry) {
          const newTalent = new UserTalents({ talent: talent._id, points: 1 });
          await newTalent.save({ session });
          user.talents.push(newTalent.toObject());
        } else {
          entry.points += 1;
          const { _id, ...fields } = entry.toObject();
          await UserTalents.updateOne({ _id }, { $set: fields }, { upsert: true, session });
        }
      }
      await user.save({ session });
      result = outcome === "criticalFailure"
        ? "Kritischer Misserfolg: Die Materialien wurden verbraucht; es wurde kein Gegenstand hergestellt."
        : outcome === "criticalSuccess"
          ? `${recipe.name} wurde hergestellt. ${profession} erhält automatisch 1 Talentpunkt.`
          : `${recipe.name} wurde hergestellt und dem Inventar hinzugefügt.`;
      await CraftingOperation.create([{ _id: operationId, user: userId, recipe: recipe._id, profession, outcome, result }], { session });
    });
    return result;
  } finally {
    await session.endSession();
  }
}

async function craft(req, res) {
  const { recipeId, profession, outcome, operationId, locationConfirmed, rollConfirmed } = req.body;
  if (!req.user || typeof recipeId !== "string" || !mongoose.isValidObjectId(recipeId) ||
      typeof profession !== "string" || !Object.prototype.hasOwnProperty.call(stations.professions, profession) ||
      !["success", "criticalSuccess", "criticalFailure"].includes(outcome) ||
      typeof operationId !== "string" || !/^[a-f0-9-]{36}$/i.test(operationId) ||
      locationConfirmed !== true || rollConfirmed !== true) {
    return res.status(400).json({ message: "Bitte bestätige Herstellungsort und Probenergebnis und prüfe deine Eingaben." });
  }
  try {
    const message = await performCraft({ userId: req.user.id, recipeId, profession, outcome, operationId });
    return res.status(200).json({ message });
  } catch (error) {
    console.error("Herstellung fehlgeschlagen:", error);
    return res.status(error.status || 500).json({ message: error.status ? error.message : "Herstellung konnte nicht abgeschlossen werden. Bitte versuche dieselbe Anfrage erneut." });
  }
}

module.exports = { craft, performCraft };
