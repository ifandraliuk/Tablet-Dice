const assert = require("assert").strict;
const User = require("../models/userModel");
const { updateAttribute } = require("./attributeController");

const names = ["vitality", "stamina", "mana", "spirit", "strength", "dexterity", "intelligent", "charisma"];

async function testAllocation() {
  const original = User.findOneAndUpdate;
  const stored = { vitality: 5, stamina: 4, strength: 3, mana: 0 };
  let pointsLeft = 13;
  let calls = 0;
  User.findOneAndUpdate = async (filter, update, options) => {
    calls += 1;
    assert.equal(filter._id, "user");
    assert.deepEqual(filter.$expr, {
      $gt: ["$pointsLeft", { $add: names.map((name) => ({ $ifNull: [`$attributes.${name}`, 0] })) }],
    });
    assert.deepEqual(options, { new: true, runValidators: true });
    const path = Object.keys(update.$inc)[0];
    const name = path.split(".")[1];
    assert.deepEqual(filter[path], { $type: "number", $gt: 0 });
    assert.equal(update.$inc[path], 1);
    const total = names.reduce((sum, key) => sum + (stored[key] || 0), 0);
    if (!(stored[name] > 0) || total >= pointsLeft) return null;
    stored[name] += 1;
    return { attributes: { ...stored }, pointsLeft };
  };
  const request = async (attr) => {
    const response = {
      status(code) { this.statusCode = code; return this; },
      json(body) { this.body = body; return this; },
    };
    await updateAttribute({ user: { id: "user" }, params: { attr } }, response, (error) => { throw error; });
    return response;
  };
  try {
    const invalid = await request("constructor");
    assert.equal(invalid.statusCode, 400);
    assert.equal(calls, 0);
    const [first, second] = await Promise.all([request("strength"), request("vitality")]);
    assert.deepEqual(first.body, { attr: "strength", value: 4, pointsLeft: 13 });
    assert.equal(first.statusCode, 200);
    assert.equal(second.statusCode, 409);
    assert.equal(stored.vitality, 5);
    pointsLeft = 14;
    assert.equal((await request("mana")).statusCode, 409);
    assert.equal(stored.mana, 0);
  } finally {
    User.findOneAndUpdate = original;
  }
}

testAllocation().then(() => {
  console.log("Attribute allocation: passed");
}).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
