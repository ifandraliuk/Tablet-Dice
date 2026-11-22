import { clearSessionStorage } from "./localStorage";

test("clears session data without deleting per-character crafting favorites", () => {
  localStorage.clear();
  localStorage.setItem("user", "private");
  localStorage.setItem("fraction", "Welles");
  localStorage.setItem("craftingFavorites:hero", '["recipe"]');
  localStorage.setItem("craftingFavorites:other", '["other"]');
  clearSessionStorage();
  expect(localStorage.getItem("user")).toBeNull();
  expect(localStorage.getItem("fraction")).toBeNull();
  expect(localStorage.getItem("craftingFavorites:hero")).toBe('["recipe"]');
  expect(localStorage.getItem("craftingFavorites:other")).toBe('["other"]');
});
