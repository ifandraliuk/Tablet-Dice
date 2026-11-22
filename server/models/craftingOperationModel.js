const mongoose = require("mongoose");

const craftingOperationSchema = new mongoose.Schema({
  _id: String,
  user: { type: mongoose.Schema.Types.ObjectId, required: true },
  recipe: { type: mongoose.Schema.Types.ObjectId, required: true },
  profession: { type: String, required: true },
  outcome: { type: String, required: true },
  result: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 2592000 },
});

module.exports = mongoose.model("CraftingOperation", craftingOperationSchema);
