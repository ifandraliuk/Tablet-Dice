export const professions = [
  { name: "Alchemie", stations: [
    { name: "Alchemiehütte", values: ["Alchemiehütte", "Alechmiehütte"] },
    { name: "Alchemiewerkstatt", values: ["Alchemiewerkstatt"] },
    { name: "Alchemieturm", values: ["Alchemieturm", "Alchemistenturm"] },
  ] },
  { name: "Holzverarbeiten", stations: [
    { name: "Zimmerei", values: ["Zimmerei"] },
    { name: "Holzwerkstatt", values: ["Holzwerkstatt"] },
    { name: "Holzmanufaktur", values: ["Holzmanufaktur"] },
  ] },
  { name: "Verzaubern", stations: [
    { name: "Stufe 1", values: [] }, { name: "Stufe 2", values: [] }, { name: "Stufe 3", values: [] },
  ] },
  { name: "Kochen", stations: [
    { name: "Lagerfeuer", values: ["Lagerfeuer"] },
    { name: "Kochstube", values: ["Kochstube"] },
    { name: "Taverne", values: ["Taverne"] },
  ] },
  { name: "Lederverarbeitung", stations: [
    { name: "Lederei", values: ["Lederei"] },
    { name: "Lederwerkstatt", values: ["Lederwerkstatt"] },
    { name: "Ledermanufaktur", values: ["Ledermanufaktur"] },
  ] },
  { name: "Schmieden", stations: [
    { name: "Schmiede", values: ["Schmiede"] },
    { name: "Edelmetallschmiede", values: ["Edelmetallschmiede"] },
    { name: "Lavaschmiede", values: ["Lavaschmiede"] },
  ] },
  { name: "Schneidern", stations: [
    { name: "Schneiderei", values: ["Schneiderei"] },
    { name: "Weberei", values: ["Weberei"] },
    { name: "Stoffmanufaktur", values: ["Stoffmanufaktur"] },
  ] },
];

export function ownInventory(inventory, userName) {
  return inventory.filter((entry) => entry.status === userName && entry.item);
}

export function materialAvailability(recipe, inventory) {
  if (!Array.isArray(recipe.material) || recipe.material.length === 0) return null;
  const amounts = new Map();
  inventory.forEach(({ item, amount }) => {
    if (item?._id && Number.isFinite(amount) && amount > 0) {
      amounts.set(item._id, (amounts.get(item._id) || 0) + amount);
    }
  });
  const requirements = new Map();
  for (const material of recipe.material) {
    if (!material.element?._id || !material.element.name || !Number.isFinite(material.amount) || material.amount <= 0) return null;
    const id = material.element._id;
    const existing = requirements.get(id);
    requirements.set(id, {
      id,
      name: material.element.name,
      item: material.element,
      required: (existing?.required || 0) + material.amount,
      available: amounts.get(id) || 0,
    });
  }
  return [...requirements.values()];
}

export function professionResources(recipes, inventory) {
  const materialIds = new Set(
    recipes.flatMap((recipe) =>
      (recipe.material || []).map((material) => material.element?._id).filter(Boolean)
    )
  );
  const resources = new Map();
  inventory.forEach(({ item, amount }) => {
    if (item?.category !== "Ressource" || !materialIds.has(item._id) || !Number.isFinite(amount) || amount <= 0) return;
    const existing = resources.get(item._id);
    resources.set(item._id, { item, amount: (existing?.amount || 0) + amount });
  });
  return [...resources.values()].sort((a, b) => a.item.name.localeCompare(b.item.name, "de"));
}
