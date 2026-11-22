const assert = require("assert").strict;
const path = require("path");
const crypto = require("crypto");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const mongoose = require("mongoose");

async function run() {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI fehlt.");
  await mongoose.connect(process.env.MONGO_URI, { dbName: "test" });
  const prefix = `crafting_test_${crypto.randomBytes(8).toString("hex")}_`;
  const originalCollection = mongoose.connection.collection.bind(mongoose.connection);
  const collectionNames = new Set();
  mongoose.connection.collection = (name, options) => {
    const isolatedName = name.startsWith(prefix) ? name : prefix + name;
    collectionNames.add(isolatedName);
    return originalCollection(isolatedName, options);
  };
  const User = require("../models/userModel");
  const Item = require("../models/itemsModel");
  const Talent = require("../models/talentModel");
  const Inventory = require("../models/inventoryModel");
  const UserTalents = require("../models/userTalentsModel");
  const Operation = require("../models/craftingOperationModel");
  const { performCraft, craft } = require("./craftingController");

  try {
    await Promise.all([User, Item, Talent, Inventory, UserTalents, Operation].map((model) => model.createCollection()));
    const talent = await Talent.create({ category: "Handwerk", name: "Schmieden", dice: "STR/GSK/AUS" });
    const wood = await Item.create({ name: "Testholz", category: "Ressource", genus: "Holz", type: "roh", value: 1 });
    const recipe = await Item.create({ name: "Testschwert", category: "Waffe", genus: "Schwert", type: "1-hand", value: 1, production: "Schmiede", material: [{ element: wood._id, amount: 2 }] });
    const lockedRecipe = await Item.create({ name: "Testdolch", category: "Waffe", genus: "Dolch", type: "1-hand", value: 1, production: "Lavaschmiede", material: [{ element: wood._id, amount: 1 }] });
    const stacks = await Inventory.create([
      { item: wood._id, amount: 1, status: "Testheld" },
      { item: wood._id, amount: 5, status: "Testheld" },
      { item: wood._id, amount: 99, status: "Ausgerüstet" },
    ]);
    const user = await User.create({ name: "Testheld", pwd: "test", inventory: stacks.map((entry) => entry.toObject()), talents: [] });
    assert.ok(await User.findById(user._id), "Test user exists");
    assert.ok(await Item.findById(lockedRecipe._id), "Test recipe exists");
    assert.ok(await Talent.findById(talent._id), "Test talent exists");
    const request = (outcome, operationId = crypto.randomUUID(), item = recipe) => ({
      userId: user._id, recipeId: String(item._id), profession: "Schmieden", outcome, operationId,
    });

    await assert.rejects(performCraft(request("success", crypto.randomUUID(), lockedRecipe)), /20 Talentpunkte/);
    const critical = request("criticalSuccess");
    const result = await performCraft(critical);
    assert.match(result, /1 Talentpunkt/);
    assert.equal(await performCraft(critical), result);
    let updated = await User.findById(user._id);
    assert.equal(updated.talents[0].points, 1);
    assert.equal((await UserTalents.findById(updated.talents[0]._id)).points, 1);
    assert.equal(updated.inventory.filter((entry) => String(entry.item) === String(recipe._id)).length, 1);
    assert.equal(updated.inventory.filter((entry) => String(entry.item) === String(wood._id) && entry.status === "Testheld").reduce((sum, entry) => sum + entry.amount, 0), 4);
    assert.equal(updated.inventory.find((entry) => entry.status === "Ausgerüstet").amount, 99);
    assert.equal(await Inventory.findById(stacks[0]._id), null);
    assert.equal((await Inventory.findById(stacks[1]._id)).amount, 4);

    const failure = await performCraft(request("criticalFailure"));
    assert.match(failure, /kein Gegenstand/);
    updated = await User.findById(user._id);
    assert.equal(updated.inventory.filter((entry) => String(entry.item) === String(recipe._id)).length, 1);
    assert.equal(updated.inventory.find((entry) => entry.status === "Testheld" && String(entry.item) === String(wood._id)).amount, 2);
    await performCraft(request("success"));
    await assert.rejects(performCraft(request("success")), /Nicht genügend Materialien/);
    updated = await User.findById(user._id);
    assert.equal(updated.inventory.filter((entry) => String(entry.item) === String(recipe._id)).length, 2);
    assert.equal(updated.talents[0].points, 1);
    assert.equal(await Operation.countDocuments(), 3);

    const newStack = await Inventory.create({ item: wood._id, amount: 2, status: "Testheld" });
    updated.inventory.push(newStack.toObject());
    await updated.save();
    const concurrent = await Promise.allSettled([performCraft(request("criticalSuccess")), performCraft(request("criticalSuccess"))]);
    assert.equal(concurrent.filter((entry) => entry.status === "fulfilled").length, 1);
    assert.equal(concurrent.filter((entry) => entry.status === "rejected").length, 1);
    updated = await User.findById(user._id);
    assert.equal(updated.talents[0].points, 2);
    assert.equal((await UserTalents.findById(updated.talents[0]._id)).points, 2);
    assert.equal(updated.inventory.filter((entry) => String(entry.item) === String(recipe._id)).length, 3);
    assert.equal(await Operation.countDocuments(), 4);

    const finalStack = await Inventory.create({ item: wood._id, amount: 2, status: "Testheld" });
    updated.inventory.push(finalStack.toObject());
    await updated.save();
    const body = { recipeId: String(recipe._id), profession: "Schmieden", outcome: "success", operationId: crypto.randomUUID(), locationConfirmed: true, rollConfirmed: false };
    const response = () => ({ status(code) { this.code = code; return this; }, json(value) { this.body = value; return this; } });
    const invalid = response();
    await craft({ user: { id: user.id }, body }, invalid);
    assert.equal(invalid.code, 400);
    body.rollConfirmed = true;
    const completed = response();
    await craft({ user: { id: user.id }, body }, completed);
    assert.equal(completed.code, 200);
    assert.match(completed.body.message, /hergestellt/);
    const repeated = response();
    await craft({ user: { id: user.id }, body }, repeated);
    assert.deepEqual(repeated.body, completed.body);
    updated = await User.findById(user._id);
    assert.equal(updated.inventory.filter((entry) => String(entry.item) === String(recipe._id)).length, 4);
    assert.equal(await Operation.countDocuments(), 5);
    console.log("Crafting integration: passed");
  } finally {
    for (const name of collectionNames) {
      if (!name.startsWith(prefix)) throw new Error("Ungültiger Test-Sammlungsname");
      const collections = await mongoose.connection.db.listCollections({ name }).toArray();
      if (collections.length) await mongoose.connection.db.dropCollection(name);
    }
    await mongoose.disconnect();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
