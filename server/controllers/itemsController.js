const asyncHandler = require("express-async-handler");

const Item = require("../models/itemsModel");

const migrateRarityValues = async (req, res, next) => {
  try {
    const rarityOrder = {
      primitiv: 1,
      gewöhnlich: 2,
      hochwertig: 3,
      magisch: 4,
      außergewöhnlich: 5,
      selten: 6,
      sagenhaft: 7,
      episch: 8,
      legendär: 9,
      einzigartig: 10,
    };

    const branches = Object.entries(rarityOrder).map(([k, v]) => ({
      case: { $eq: ["$rarity", k] },
      then: v,
    }));

    // MongoDB ≥ 4.2: Aggregation-Pipeline in updateMany
    const result = await Item.updateMany({}, [
      {
        $set: {
          rarityValue: {
            $switch: { branches, default: 0 },
          },
        },
      },
    ]);

    // Optional: Index für schnellere Sortierung (idempotent)
    try {
      await Item.collection.createIndex({
        category: 1,
        genus: 1,
        rarityValue: 1,
      });
    } catch (_) {}

    res.status(200).json({
      ok: true,
      matched: result.matchedCount,
      modified: result.modifiedCount,
    });
  } catch (err) {
    next(err);
  }
};

const setItem = asyncHandler(async (req, res) => {
  if (!req.body.name) {
    res.status(400);
    throw new Error("Falsch! Das Feld darf nicht leer sein");
  }

  const newItem = await Item.create({
    name: req.body.name,
    value: req.body.value,
    category: req.body.category,
    genus: req.body.genus,
    type: req.body.type,
    rarity: req.body.rarity,
    material: req.body.material,
    dice: req.body.dice,
    bonuses: req.body.bonuses,
    set: req.body.set,
    description: req.body.description,
    weight: req.body.weight,
    price: req.body.price,
    status: req.body.status,
    companion: req.body.companion,
  });
  if (!newItem) {
    res.status(400);
    throw new Error("Falsch! Die Eingaben sind nicht korrekt");
  }
  res.status(200).json(newItem);
});

const updateItem = asyncHandler(async (req, res) => {
  if (!req.params.name) {
    res.status(400);
    throw new Error("Falsch! Das Feld darf nicht leer sein");
  }
  let attr = Object.keys(req.body);
  let val = Object.values(req.body);
  const item = await Item.findOne({ name: req.params.name });
  if (!item) {
    res.status(400);
    throw new Error("Das Item wurde nicht gefunden");
  }
  updated = await Item.findOneAndUpdate(
    {
      name: req.params.name,
    },

    req.body,
    { new: true }
  );
  if (!updated) {
    res.status(400).json("Das Item konnte nicht updated werden");
    throw new Error("Das Item konnte nicht updated werden");
  }
  res.status(200).json(updated);
});
const findItem = asyncHandler(async (req, res) => {
  if (!req.body.name) {
    res.status(400).json({ message: "Nicht gefunden" });
    throw new Error("Falsch! Das Feld darf nicht leer sein");
  } else {
    const items = await Item.find({ name: req.body.name });
    res.status(200).json(items);
  }
});

/* const getSearchInCategory = asyncHandler(async (req, res) => {
  console.log("backend get search in category ");
  const { category,genus, n, searchText } = req.params;
  console.log(req.params);
    const rarityOrder = {
    primitiv: 1,
    gewöhnlich: 2,
    hochwertig: 3,
    magisch: 4,
    außergewöhnlich: 5,
    selten: 6,
    sagenhaft: 7,
    episch: 8,
    legendär: 9,
    einzigartig: 10,
  };
  let items = null
  if(searchText.length>0){
    // ignore genus
  const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const safe = escapeRegex(searchText.trim());

  // Für "enthält": ohne ^ — für "beginnt mit": ^${safe}
  const nameFilter = safe ? { name: { $regex: safe, $options: "i" } } : {};

  items = await Item.find({category, ...nameFilter})
    .skip(parseInt(n))
    .limit(10)
    .collation({ locale: "de", strength: 1 })
    .populate({
      path: "material.element",
      model: "Item",
    });

  } else {
    // normal category load
    items = await Item.find({ category: category, genus: genus })
    .skip(0)
    .limit(10)
    .populate({
      path: "material.element",
      model: "Item",
    });
  }
  if(!items){
    res.status(400).json({message:"Nothing found"})
  }
  items.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);
  console.log(items.length);
  res.status(200).json({ data: items});
}); */
const getSearchInCategory = asyncHandler(async (req, res) => {
  console.log("backend get search in category");
  const { category, genus, n = 0, searchText = "", rarity = "none" } = req.params;

  const skipCount = parseInt(n, 10) || 0;
  const limitCount = 10;

  // Falls du ganz sicher gehen willst, dass nichts ohne rarityValue reinrutscht:
  // const rarityGuard = { rarityValue: { $type: "number" } };

  // Suche: genus ignorieren (wie bisher)
  const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const safe = escapeRegex(searchText.trim());

  const filter =
    searchText && searchText !== ""
      ? { category, ...(safe ? { name: { $regex: safe, $options: "i" } } : {}) }
      : { category, genus };

  if (rarity && rarity !== "none"  && rarity !== "") filter.rarity = rarity;
  console.log(filter);

  const items = await Item.find(filter)
    .sort({ rarityValue: 1, _id: 1 }) // ← WICHTIG: Sortierung VOR Pagination
    .skip(skipCount)
    .limit(limitCount)
    .collation({ locale: "de", strength: 1 }) // optional (für name-Sortierung; schadet hier nicht)
    .populate({ path: "material.element", model: "Item" });
console.log(items.length)
  res.status(200).json({ data: items });
});

const getItem = asyncHandler(async (req, res) => {
  console.log("backend get item");
  const { n, m, category, genus,rarity = "" } = req.params;
  console.log(req.params);
  const skipCount = parseInt(n) || 0; // Default to 0 if not provided
  const limitCount = 10; // Default to 10 if not provided

  const rarityOrder = {
    primitiv: 1,
    gewöhnlich: 2,
    hochwertig: 3,
    magisch: 4,
    außergewöhnlich: 5,
    selten: 6,
    sagenhaft: 7,
    episch: 8,
    legendär: 9,
    einzigartig: 10,
  };
  const search = rarity && rarity !== "none"  && rarity !== "" ? { category: category, genus: genus, rarity: rarity } : { category: category, genus: genus }
  const items = await Item.find(search)
    .skip(parseInt(skipCount))
    .limit(parseInt(limitCount))
    .populate({
      path: "material.element",
      model: "Item",
    });
  items.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);
  console.log(items.length);
  res.status(200).json({ data: items, n: parseInt(n), m: parseInt(m) });
});

const rename = asyncHandler(async (req, res) => {
  const items = await Item.updateMany(
    { rarity: "Selten" },
    { $set: { rarity: "selten" } },
    { new: true }
  );
  if (!items) {
    res.status(400).json("fehlschlag");
  }
  res.json({ message: "renamed" });
});

module.exports = {
  setItem,
  getSearchInCategory,
  getItem,
  findItem,
  updateItem,
  rename,
  migrateRarityValues,
};
