const assert = require("assert").strict;
const User = require("../models/userModel");
const { updateLevel } = require("./playerController");

async function testLevelUp() {
  const original = User.findByIdAndUpdate;
  try {
    for (const [level, expectedPoints] of [[5, 71], [10, 71], [9, 70]]) {
      let updateCalls = 0;
      User.findByIdAndUpdate = async () => ({
        level,
        pointsLeft: 70,
        updateOne: async (change) => {
          updateCalls += 1;
          assert.deepEqual(change, { $inc: { pointsLeft: 1 } });
        },
      });
      const response = {
        status(code) { this.statusCode = code; return this; },
        json(body) { this.body = body; return this; },
      };
      await updateLevel({ user: { id: "user" } }, response, (error) => { throw error; });
      assert.equal(response.statusCode, 200);
      assert.deepEqual(response.body, { level, pointsLeft: expectedPoints });
      assert.equal(updateCalls, level % 5 === 0 ? 1 : 0);
    }
  } finally {
    User.findByIdAndUpdate = original;
  }
}

testLevelUp().then(() => {
  console.log("Level-up attribute point response: passed");
}).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
