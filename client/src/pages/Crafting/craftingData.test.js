import { materialAvailability, ownInventory, professionResources, professions, stationAccess } from "./craftingData";

test("counts only owned stacks and combines repeated ingredients", () => {
  const wood = { _id: "wood", name: "Buchenholz", category: "Ressource" };
  const inventory = [
    { item: wood, amount: 1, status: "Held" },
    { item: wood, amount: 2, status: "Held" },
    { item: wood, amount: 10, status: "Ausgerüstet" },
    { item: wood, amount: 10, status: "Begleiter" },
  ];
  const recipe = { material: [{ element: wood, amount: 2 }, { element: wood, amount: 2 }] };
  expect(materialAvailability(recipe, ownInventory(inventory, "Held"))).toEqual([
    { id: "wood", name: "Buchenholz", item: wood, available: 3, required: 4 },
  ]);
});

test("lists only owned resources referenced by any recipe in the profession", () => {
  const wood = { _id: "wood", name: "Buchenholz", category: "Ressource" };
  const meat = { _id: "meat", name: "Fleisch", category: "Ressource" };
  const chitin = { _id: "chitin", name: "Chitin", category: "Ressource" };
  const inventory = [
    { item: wood, amount: 1, status: "Held" },
    { item: meat, amount: 2, status: "Held" },
    { item: meat, amount: 3, status: "Held" },
    { item: chitin, amount: 4, status: "Held" },
    { item: meat, amount: 99, status: "Ausgerüstet" },
  ];
  const recipes = [{ material: [{ element: meat }] }, { material: [{ element: wood }] }];
  expect(professionResources(recipes, ownInventory(inventory, "Held"))).toEqual([
    { item: wood, amount: 1 },
    { item: meat, amount: 5 },
  ]);
  expect(professionResources([], ownInventory(inventory, "Held"))).toEqual([]);
});

test("does not claim readiness when recipe materials are missing or invalid", () => {
  expect(materialAvailability({ material: [] }, [])).toBeNull();
  expect(materialAvailability({ material: [{ element: null, amount: 1 }] }, [])).toBeNull();
  expect(materialAvailability({ material: [{ element: { _id: "a", name: "A" }, amount: 0 }] }, [])).toBeNull();
});

test("assigns three ordered stations and known database spellings", () => {
  expect(professions).toHaveLength(7);
  expect(professions.every((profession) => profession.stations.length === 3)).toBe(true);
  expect(professions.every((profession) => profession.description.length > 0)).toBe(true);
  expect(professions.find((profession) => profession.name === "Verzaubern").description).toMatch(/folgen später/);
  const alchemy = professions.find((profession) => profession.name === "Alchemie");
  expect(alchemy.stations[0].values).toContain("Alechmiehütte");
  expect(alchemy.stations[2].values).toContain("Alchemistenturm");
});

test.each([
  [0, ["exception", "locked", "locked"]],
  [1, ["unlocked", "locked", "locked"]],
  [9, ["unlocked", "locked", "locked"]],
  [10, ["unlocked", "unlocked", "locked"]],
  [19, ["unlocked", "unlocked", "locked"]],
  [20, ["unlocked", "unlocked", "unlocked"]],
  [21, ["unlocked", "unlocked", "unlocked"]],
])("applies station thresholds at %i talent points", (points, expected) => {
  expect([0, 1, 2].map((index) => stationAccess(points, index))).toEqual(expected);
});

test("rejects invalid station indices", () => {
  expect(stationAccess(1, -1)).toBe("locked");
  expect(stationAccess(1, 3)).toBe("locked");
});
