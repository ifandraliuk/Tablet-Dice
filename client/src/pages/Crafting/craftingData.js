import stations from "./stations.json";

export const professions = [
  { name: "Alchemie", description: "Verarbeite Pflanzen zu Essenzen, Tränken und Giften.", stations: [
    { name: "Alchemiehütte" },
    { name: "Alchemiewerkstatt" },
    { name: "Alchemieturm" },
  ] },
  { name: "Holzverarbeiten", description: "Fertige Bögen, Armbrüste und Werkzeuge für deine Abenteuer.", stations: [
    { name: "Zimmerei" },
    { name: "Holzwerkstatt" },
    { name: "Holzmanufaktur" },
  ] },
  { name: "Verzaubern", description: "Erkunde die Kunst der Verzauberung. Rezepte und Herstellungsorte folgen später.", stations: [
    { name: "Stufe 1" }, { name: "Stufe 2" }, { name: "Stufe 3" },
  ] },
  { name: "Kochen", description: "Bereite aus Zutaten Speisen und Getränke zu.", stations: [
    { name: "Lagerfeuer" },
    { name: "Kochstube" },
    { name: "Taverne" },
  ] },
  { name: "Lederverarbeitung", description: "Verarbeite Materialien zu Rüstungsteilen und Sätteln.", stations: [
    { name: "Lederei" },
    { name: "Lederwerkstatt" },
    { name: "Ledermanufaktur" },
  ] },
  { name: "Schmieden", description: "Schmiede Waffen, Rüstungsteile und Werkzeuge.", stations: [
    { name: "Schmiede" },
    { name: "Edelmetallschmiede" },
    { name: "Lavaschmiede" },
  ] },
  { name: "Schneidern", description: "Fertige Garn und Stoffe sowie Kleidung und Roben.", stations: [
    { name: "Schneiderei" },
    { name: "Weberei" },
    { name: "Stoffmanufaktur" },
  ] },
].map((profession) => ({
  ...profession,
  stations: profession.stations.map((station, index) => ({
    ...station,
    values: stations.professions[profession.name][index],
  })),
}));

export const stationPointRequirements = stations.thresholds;

export function stationAccess(points, index) {
  if (!Number.isInteger(index) || index < 0 || index >= stationPointRequirements.length) return "locked";
  if (points >= stationPointRequirements[index]) return "unlocked";
  return index === 0 ? "exception" : "locked";
}

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
