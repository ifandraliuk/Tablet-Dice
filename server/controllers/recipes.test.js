const assert = require("assert").strict;
const Item = require("../models/itemsModel");
const { getRecipes } = require("./itemsController");

async function run() {
  const original = Item.find;
  const recorded = {};
  Item.find = (filter) => {
    recorded.filter = filter;
    return {
      sort(value) { recorded.sort = value; return this; },
      async populate(value) { recorded.populate = value; return [{ name: "Schwert" }]; },
    };
  };
  const request = async (production) => {
    const res = {
      status(code) { this.code = code; return this; },
      json(body) { this.body = body; return this; },
    };
    await getRecipes({ query: { production } }, res, (error) => { throw error; });
    return res;
  };
  try {
    assert.equal((await request(undefined)).code, 400);
    assert.equal((await request([{ $ne: "" }])).code, 400);
    const response = await request(["Schmiede", "Lavaschmiede"]);
    assert.equal(response.code, 200);
    assert.deepEqual(recorded.filter, { production: { $in: ["Schmiede", "Lavaschmiede"] } });
    assert.equal(recorded.populate.path, "material.element");
    assert.equal(recorded.populate.select, "name category genus rarity");
    assert.deepEqual(response.body, [{ name: "Schwert" }]);
  } finally {
    Item.find = original;
  }
}
run().then(() => console.log("Recipe endpoint: passed")).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
