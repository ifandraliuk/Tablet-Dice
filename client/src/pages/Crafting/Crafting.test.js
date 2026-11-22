import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Crafting from "./index";

jest.mock("axios", () => ({ get: jest.fn() }));
jest.mock("../../components/useTalentProbeData", () => () => ({
  attributes: { strength: 10, dexterity: 15, stamina: 10, vitality: 10 },
  boni: [{ bonus: { type: "Schmieden" }, value: 1 }],
  error: "",
  retry: jest.fn(),
}));
jest.mock("react-router-dom", () => {
  const navigate = jest.fn();
  return { useNavigate: () => navigate, useLocation: jest.fn(), Link: ({ to, state, children, ...props }) => <a href={to} {...props}>{children}</a> };
});
jest.mock("../../features/talent/talentSlice", () => ({
  getTalent: () => ({ type: "talents" }),
  getPlayerTalent: () => ({ type: "playerTalents" }),
}));
jest.mock("../../features/inventory/inventorySlice", () => ({
  getInventory: () => ({ type: "inventory" }),
}));
jest.mock("react-redux", () => {
  const dispatch = (action) => ({ unwrap: () => Promise.resolve({
    talents: [
      { _id: "smith", name: "Schmieden", category: "Handwerk", dice: "STR/GSK/AUS" },
      { _id: "cook", name: "Kochen", category: "Handwerk", dice: "VIT/GSK/AUS" },
    ],
    playerTalents: [{ talent: { _id: "smith" }, points: 2 }],
    inventory: { data: [
      { status: "Held", item: { _id: "wood", name: "Buchenholz", category: "Ressource", genus: "Holz" }, amount: 1 },
      { status: "Held", item: { _id: "chitin", name: "Chitin", category: "Ressource", genus: "Material" }, amount: 7 },
      { status: "Ausgerüstet", item: { _id: "wood", name: "Buchenholz", category: "Ressource" }, amount: 10 },
    ] },
  }[action.type]) });
  return { useDispatch: () => dispatch, useSelector: jest.fn() };
});

beforeEach(() => {
  localStorage.clear();
  useLocation.mockReturnValue({ state: null });
  const state = {
    auth: { user: { _id: "hero", name: "Held" } },
    player: { fractionTheme: "Welles" },
    inventory: { inventory: [], extendedId: "" },
    diaries: { userList: [] },
  };
  useSelector.mockImplementation((selector) => selector(state));
  axios.get.mockResolvedValue({ data: [
    { _id: "sword", name: "Schwert", category: "Waffe", genus: "Schwert", rarity: "selten", dice: "1W8", bonuses: "+2 Stärke", description: "Eine verlässliche Klinge.", production: "Schmiede", material: [{ element: { _id: "wood", name: "Buchenholz", category: "Ressource", genus: "Holz" }, amount: 2 }] },
    { _id: "dagger", name: "Dolch", category: "Waffe", genus: "Dolch", production: "Lavaschmiede", material: [{ element: { _id: "wood", name: "Buchenholz", category: "Ressource", genus: "Holz" }, amount: 1 }] },
  ] });
});

test("shows learned professions, recipe shortages, search, filters and persistent favorites", async () => {
  render(<Crafting />);
  const smith = await screen.findByRole("button", { name: /Schmieden/ });
  expect(smith).toHaveTextContent("1. Schmiede");
  expect(smith).toHaveTextContent("3. Lavaschmiede");
  expect(smith).toHaveTextContent("Schmiede Waffen, Rüstungsteile und Werkzeuge.");
  expect(smith).toHaveTextContent("Beruf entdecken");
  expect(smith).toHaveTextContent("3/3");
  expect(smith.querySelectorAll(".crafting-profession__station.is-unlocked")).toHaveLength(3);
  expect(screen.queryByRole("button", { name: /Kochen/ })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Alle Berufe" }));
  expect(screen.getByRole("button", { name: /Kochen/ })).toHaveTextContent("Noch nicht gelernt");
  expect(screen.getByRole("button", { name: /Kochen/ })).toHaveTextContent("Bereite aus Zutaten Speisen und Getränke zu.");
  const cook = screen.getByRole("button", { name: /Kochen/ });
  expect(cook).toHaveTextContent("0/3");
  expect(cook).toHaveTextContent("1. Lagerfeuer · ungelernt mit Malus nutzbar");
  expect(cook).toHaveTextContent("2. Kochstube · gesperrt");
  expect(cook.querySelectorAll(".crafting-profession__station.is-unlocked")).toHaveLength(0);
  fireEvent.click(smith);
  const dialog = await screen.findByRole("region", { name: "Schmieden · Herstellung" });
  expect(dialog).toHaveTextContent("STR/GSK/AUS");
  expect(dialog).toHaveTextContent("10 / 15 / 10");
  expect(dialog).toHaveTextContent("Ausgleich: 2 Talentpunkte + 1 Ausrüstungsbonus = 3");
  expect(dialog).toHaveTextContent("2 Talentpunkte");
  expect(within(dialog).queryByText("Entdecke Schmieden")).not.toBeInTheDocument();
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  fireEvent.change(within(dialog).getByLabelText("Herstellungsort"), { target: { value: "" } });
  fireEvent.change(within(dialog).getByLabelText("Anzeige"), { target: { value: "all" } });
  const sword = (await within(dialog).findByText("Schwert")).closest("article");
  const dagger = within(dialog).getByText("Dolch").closest("article");
  expect(within(sword).getByText("selten")).toHaveClass("extended-info-rarity", "rare");
  expect(dagger.querySelector(".extended-info-rarity")).not.toBeInTheDocument();
  expect(within(dagger).queryByText(/Herstellungsort vorläufig gesperrt/)).not.toBeInTheDocument();
  expect(within(dialog).getAllByRole("article")[0]).toBe(dagger);
  expect(sword).toHaveTextContent("Buchenholz: 1/2");
  expect(sword).toHaveTextContent("1 fehlt");
  expect(within(sword).getByText("1/2")).toHaveClass("crafting-material-count--missing");
  expect(within(dagger).getByText("1/1")).toHaveClass("crafting-material-count--ready");
  expect(sword.querySelector('img[name="sword"]')).toHaveAttribute("src", expect.stringContaining("/sword.svg"));
  expect(sword.querySelector('img[name="wood"]')).toHaveAttribute("src", expect.stringContaining("/wood.svg"));
  const resources = within(dialog).getByRole("complementary", { name: "Deine Ressourcen" });
  expect(within(dialog).getByRole("link", { name: "Zu deinen Ressourcen ↓" })).toHaveAttribute("href", "#crafting-inventory-title");
  expect(within(resources).getByRole("link", { name: "↑ Zurück zu den Rezepten" })).toHaveAttribute("href", "#crafting-recipes");
  expect(resources).toHaveTextContent("Buchenholz");
  expect(resources).not.toHaveTextContent("Chitin");
  expect(resources.querySelector('img[name="wood"]')).toHaveAttribute("src", expect.stringContaining("/wood.svg"));
  expect(within(dialog).getAllByRole("button", { name: "Herstellen · demnächst" })[0]).toBeDisabled();
  fireEvent.click(within(dialog).getByRole("button", { name: "Schwert als Favorit speichern" }));
  expect(JSON.parse(localStorage.getItem("craftingFavorites:hero"))).toEqual(["sword"]);
  fireEvent.click(within(dialog).getByRole("switch", { name: "Nur Favoriten" }));
  expect(within(dialog).getByRole("switch", { name: "Nur Favoriten" })).toBeChecked();
  expect(within(dialog).getByText("Schwert")).toBeInTheDocument();
  expect(within(dialog).queryByText("Dolch")).not.toBeInTheDocument();
  fireEvent.change(within(dialog).getByLabelText("Anzeige"), { target: { value: "ready" } });
  expect(within(dialog).getByText(/oder den Favoritenfilter/)).toBeInTheDocument();
  expect(within(dialog).getByRole("option", { name: "Alle Stufen (0)" })).toBeInTheDocument();
  fireEvent.change(within(dialog).getByLabelText("Anzeige"), { target: { value: "all" } });
  expect(within(dialog).getByText("Schwert")).toBeInTheDocument();
  fireEvent.change(within(dialog).getByLabelText("Rezept suchen"), { target: { value: "nichts" } });
  expect(within(dialog).getByText(/Keine Rezepte/)).toBeInTheDocument();
  expect(resources).toHaveTextContent("Buchenholz");
  fireEvent.change(within(dialog).getByLabelText("Herstellungsort"), { target: { value: "3" } });
  fireEvent.click(within(dialog).getByRole("button", { name: "← Zur Berufsauswahl" }));
  expect(screen.queryByRole("region", { name: "Schmieden · Herstellung" })).not.toBeInTheDocument();
  axios.get.mockResolvedValueOnce({ data: [] });
  fireEvent.click(screen.getByRole("button", { name: /Kochen/ }));
  const cooking = await screen.findByRole("region", { name: "Kochen · Herstellung" });
  expect(await within(cooking).findByText(/keine Rezepte/i)).toBeInTheDocument();
  expect(within(cooking).getByText("Keine passenden Ressourcen im Inventar.")).toBeInTheDocument();
});

test("filters recipes by station and available materials", async () => {
  render(<Crafting />);
  fireEvent.click(await screen.findByRole("button", { name: /Schmieden/ }));
  const dialog = await screen.findByRole("region", { name: "Schmieden · Herstellung" });
  fireEvent.change(within(dialog).getByLabelText("Herstellungsort"), { target: { value: "" } });
  fireEvent.change(within(dialog).getByLabelText("Anzeige"), { target: { value: "all" } });
  await within(dialog).findByText("Schwert");
  fireEvent.change(within(dialog).getByLabelText("Anzeige"), { target: { value: "ready" } });
  expect(within(dialog).queryByText("Schwert")).not.toBeInTheDocument();
  expect(within(dialog).getByText("Dolch")).toBeInTheDocument();
  fireEvent.change(within(dialog).getByLabelText("Herstellungsort"), { target: { value: "1" } });
  expect(within(dialog).getByText(/Keine Rezepte/)).toBeInTheDocument();
});

test("reports recipe loading failures and permits retry", async () => {
  axios.get.mockRejectedValueOnce(new Error("Netzwerkfehler"));
  render(<Crafting />);
  fireEvent.click(await screen.findByRole("button", { name: /Schmieden/ }));
  const dialog = await screen.findByRole("region", { name: "Schmieden · Herstellung" });
  expect(await within(dialog).findByRole("alert")).toHaveTextContent("Netzwerkfehler");
  fireEvent.click(within(dialog).getByRole("button", { name: "Erneut versuchen" }));
  fireEvent.change(within(dialog).getByLabelText("Anzeige"), { target: { value: "all" } });
  expect(await within(dialog).findByText("Schwert")).toBeInTheDocument();
});

test("switches professions directly and resets recipe filters", async () => {
  render(<Crafting />);
  fireEvent.click(await screen.findByRole("button", { name: /Schmieden/ }));
  const smith = await screen.findByRole("region", { name: "Schmieden · Herstellung" });
  expect(within(smith).getByLabelText("Herstellungsort")).toHaveValue("1");
  expect(within(smith).getByLabelText("Anzeige")).toHaveValue("ready");
  expect(await within(smith).findByText(/Passe die Suche/)).toBeInTheDocument();
  expect(within(smith).getByRole("option", { name: "Alle Stufen (1)" })).toBeInTheDocument();
  expect(within(smith).getByRole("option", { name: "1. Schmiede (0)" })).toBeInTheDocument();
  expect(within(smith).getByRole("option", { name: "3. Lavaschmiede (1)" })).toBeInTheDocument();
  fireEvent.change(within(smith).getByLabelText("Herstellungsort"), { target: { value: "" } });
  fireEvent.change(within(smith).getByLabelText("Anzeige"), { target: { value: "all" } });
  await within(smith).findByText("Schwert");
  expect(within(smith).getByRole("option", { name: "1. Schmiede (1)" })).toBeInTheDocument();
  fireEvent.change(within(smith).getByLabelText("Rezept suchen"), { target: { value: "Schwert" } });
  expect(within(smith).getByRole("option", { name: "3. Lavaschmiede (0)" })).toBeInTheDocument();
  fireEvent.click(within(smith).getByRole("switch", { name: "Nur Favoriten" }));
  axios.get.mockResolvedValueOnce({ data: [] });
  fireEvent.change(within(smith).getByLabelText("Beruf wechseln"), { target: { value: "Kochen" } });
  const cooking = await screen.findByRole("region", { name: "Kochen · Herstellung" });
  expect(within(cooking).getByLabelText("Rezept suchen")).toHaveValue("");
  expect(within(cooking).getByLabelText("Herstellungsort")).toHaveValue("1");
  expect(within(cooking).getByLabelText("Anzeige")).toHaveValue("ready");
  expect(within(cooking).getByRole("switch", { name: "Nur Favoriten" })).not.toBeChecked();
  expect(within(cooking).getByText("Noch nicht gelernt · 0 Punkte")).toBeInTheDocument();
  expect(within(cooking).getByText(/Auch ungelernt kannst du alle Rezepte ansehen/)).toHaveTextContent("−1 auf jeden Attributwert");
  expect(within(cooking).getByRole("link", { name: "Talent Kochen ansehen →" })).toHaveAttribute("href", "/talents?talent=Kochen");
  expect(cooking).toHaveTextContent("VIT/GSK/AUS");
  expect(cooking).toHaveTextContent("9 / 14 / 9");
  expect(cooking).toHaveTextContent("Ungelernt: −1 je Attribut");
  await waitFor(() => expect(within(cooking).getByText(/keine Rezepte/i)).toBeInTheDocument());
});

test("sorts ready recipes before pagination without treating incomplete data as ready", async () => {
  const wood = { _id: "wood", name: "Buchenholz", category: "Ressource", genus: "Holz" };
  axios.get.mockResolvedValueOnce({ data: [
    { _id: "unknown", name: "Unbekannt", production: "Schmiede", material: [] },
    ...Array.from({ length: 12 }, (_, index) => ({
      _id: `missing-${index}`, name: `Fehlend ${index}`, production: "Schmiede", material: [{ element: wood, amount: 2 }],
    })),
    { _id: "ready", name: "Bereit", production: "Schmiede", material: [{ element: wood, amount: 1 }] },
  ] });
  render(<Crafting />);
  fireEvent.click(await screen.findByRole("button", { name: /Schmieden/ }));
  const detail = await screen.findByRole("region", { name: "Schmieden · Herstellung" });
  fireEvent.change(within(detail).getByLabelText("Anzeige"), { target: { value: "all" } });
  expect(await within(detail).findByText("Bereit")).toBeInTheDocument();
  const articles = within(detail).getAllByRole("article");
  expect(articles).toHaveLength(12);
  expect(articles[0]).toHaveTextContent("Bereit");
  expect(articles[1]).toHaveTextContent("Unbekannt");
  expect(articles[1]).toHaveTextContent("Materialangaben unvollständig");
  fireEvent.change(within(detail).getByLabelText("Anzeige"), { target: { value: "ready" } });
  expect(within(detail).getAllByRole("article")).toHaveLength(1);
  expect(within(detail).queryByText("Unbekannt")).not.toBeInTheDocument();
});

test("keeps recipes discoverable for unlearned professions", async () => {
  axios.get.mockResolvedValueOnce({ data: [
    { _id: "meal", name: "Mahlzeit", production: "Lagerfeuer", material: [{ element: { _id: "wood", name: "Buchenholz" }, amount: 1 }] },
    { _id: "soup", name: "Suppe", production: "Kochstube", material: [{ element: { _id: "wood", name: "Buchenholz" }, amount: 1 }] },
  ] });
  render(<Crafting />);
  await screen.findByRole("button", { name: /Schmieden/ });
  fireEvent.click(screen.getByRole("button", { name: "Alle Berufe" }));
  fireEvent.click(screen.getByRole("button", { name: /Kochen/ }));
  const detail = await screen.findByRole("region", { name: "Kochen · Herstellung" });
  const recipe = (await within(detail).findByText("Mahlzeit")).closest("article");
  expect(within(recipe).getByText("Material vorhanden")).toBeInTheDocument();
  expect(within(recipe).getByText("Erster Ort: ungelernt mit Malus nutzbar")).toBeInTheDocument();
  expect(within(detail).getByRole("button", { name: "Herstellen · demnächst" })).toBeDisabled();
  fireEvent.change(within(detail).getByLabelText("Herstellungsort"), { target: { value: "2" } });
  const soup = within(detail).getByText("Suppe").closest("article");
  expect(within(soup).getByText("Herstellungsort vorläufig gesperrt")).toBeInTheDocument();
  expect(within(soup).getByRole("button", { name: "Herstellen · demnächst" })).toBeDisabled();
});

test("restores profession and recipe filters when returning from talents", async () => {
  localStorage.setItem("craftingFavorites:hero", JSON.stringify(["dagger"]));
  useLocation.mockReturnValue({ state: { craftingReturn: {
    userId: "hero", profession: "Schmieden", tab: "all", search: "Dolch",
    station: "3", filter: "all", favoritesOnly: true, visibleCount: 24,
  } } });
  render(<Crafting />);
  const detail = await screen.findByRole("region", { name: "Schmieden · Herstellung" });
  expect(within(detail).getByLabelText("Rezept suchen")).toHaveValue("Dolch");
  expect(within(detail).getByLabelText("Herstellungsort")).toHaveValue("3");
  expect(within(detail).getByLabelText("Anzeige")).toHaveValue("all");
  expect(within(detail).getByRole("switch", { name: "Nur Favoriten" })).toBeChecked();
  expect(await within(detail).findByText("Dolch")).toBeInTheDocument();
  fireEvent.click(within(detail).getByRole("button", { name: "← Zur Berufsauswahl" }));
  expect(screen.getByRole("button", { name: "Alle Berufe" })).toHaveAttribute("aria-pressed", "true");
});

test("does not restore crafting state belonging to another character", async () => {
  useLocation.mockReturnValue({ state: { craftingReturn: { userId: "other", profession: "Kochen" } } });
  render(<Crafting />);
  expect(await screen.findByRole("button", { name: /Schmieden/ })).toBeInTheDocument();
  expect(screen.queryByRole("region", { name: /Kochen · Herstellung/ })).not.toBeInTheDocument();
});

test("opens read-only item details for a recipe and returns to the same selection", async () => {
  render(<Crafting />);
  fireEvent.click(await screen.findByRole("button", { name: /Schmieden/ }));
  const detail = await screen.findByRole("region", { name: "Schmieden · Herstellung" });
  fireEvent.change(within(detail).getByLabelText("Anzeige"), { target: { value: "all" } });
  const infoButton = await within(detail).findByRole("button", { name: "Informationen zu Schwert" });
  infoButton.focus();
  fireEvent.click(infoButton);
  const popup = screen.getByRole("dialog", { name: "Gegenstand: Schwert" });
  expect(popup).toHaveTextContent("1W8");
  expect(popup).toHaveTextContent("+2 Stärke");
  expect(popup).toHaveTextContent("Eine verlässliche Klinge.");
  expect(within(popup).queryByRole("button", { name: /hinzufügen|abziehen|teilen|löschen|ausrüsten|aufteilen/i })).not.toBeInTheDocument();
  fireEvent.click(within(popup).getByRole("button", { name: "Fenster schließen" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(infoButton).toHaveFocus();
  expect(within(detail).getByLabelText("Anzeige")).toHaveValue("all");
  fireEvent.click(infoButton);
  fireEvent.keyDown(window, { key: "Escape" });
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
