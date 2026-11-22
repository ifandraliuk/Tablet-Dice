import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import CraftingDialog from "./CraftingDialog";

jest.mock("axios", () => ({ post: jest.fn() }));
const props = {
  recipe: { _id: "item", name: "Schwert", rarity: "selten", category: "Waffe", genus: "Schwert", type: "1-hand", dice: "1W8", bonuses: "+2 Stärke", description: "Eine Klinge.", weight: 2 },
  profession: "Schmieden", station: "Schmiede", token: "token", fractionTheme: "Welles",
  requirements: [{ id: "wood", name: "Buchenholz", required: 2, item: { _id: "wood", name: "Buchenholz", category: "Ressource", genus: "Holz" } }],
  talentDice: "STR/GSK/AUS", points: 2, bonus: 1,
  probeData: { attributes: { strength: 10, dexterity: 15, stamina: 10 } },
  onClose: jest.fn(), onRefresh: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
  Object.defineProperty(window, "crypto", { configurable: true, value: { randomUUID: () => "12345678-1234-1234-1234-123456789abc" } });
});

test.each([
  ["Erfolg", "success", "Herstellung abschließen"],
  ["Kritischer Erfolg", "criticalSuccess", "Herstellung abschließen"],
  ["Kritischer Misserfolg", "criticalFailure", "Misserfolg bestätigen"],
])("confirms location and %s before submitting", async (label, outcome, action) => {
  axios.post.mockResolvedValue({ data: { message: "Vorgang abgeschlossen" } });
  props.onRefresh.mockResolvedValue();
  render(<CraftingDialog {...props} />);
  expect(screen.getByText("Schwert")).toBeInTheDocument();
  expect(screen.getByText("Buchenholz")).toBeInTheDocument();
  expect(screen.getByLabelText("2 werden verbraucht")).toHaveTextContent("−2");
  expect(document.querySelector('img[name="wood"]')).toBeInTheDocument();
  expect(screen.getByText("Waffe · Schwert · 1-hand")).toBeInTheDocument();
  expect(screen.getByText("+2 Stärke")).toBeInTheDocument();
  expect(screen.getByText("1W8")).toBeInTheDocument();
  expect(screen.getByText("Eine Klinge.")).toBeInTheDocument();
  expect(screen.getByText("STR/GSK/AUS")).toBeInTheDocument();
  expect(screen.getByText("10 / 15 / 10")).toBeInTheDocument();
  expect(screen.getByText("Ausgleich: 2 Talentpunkte + 1 Ausrüstungsbonus = 3")).toBeInTheDocument();
  expect(screen.getByText("0/2")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Herstellung abschließen" })).toBeDisabled();
  fireEvent.click(screen.getByLabelText(/Ich befinde mich/));
  expect(screen.getByText("1/2")).toBeInTheDocument();
  fireEvent.click(screen.getByLabelText(label, { exact: true }));
  fireEvent.click(screen.getByLabelText(/Ich bestätige das unten/));
  expect(screen.getByText("2/2")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: action }));
  await screen.findByText("Vorgang abgeschlossen");
  expect(axios.post).toHaveBeenCalledWith("/inventory/craft", expect.objectContaining({ outcome, locationConfirmed: true, rollConfirmed: true }), expect.any(Object));
  expect(props.onRefresh).toHaveBeenCalled();
});

test("shows the unlearned penalty and unavailable probe values without inventing them", () => {
  render(<CraftingDialog {...props} points={0} bonus={0} probeData={{ attributes: null, error: "Fehler", retry: jest.fn() }} />);
  expect(screen.getByText("Probenwerte nicht verfügbar")).toBeInTheDocument();
  expect(screen.getByText("Ungelernt: −1 je Attribut")).toBeInTheDocument();
  expect(screen.getByRole("alert")).toHaveTextContent("Fehler");
});

test("retries an uncertain request using the same operation id", async () => {
  axios.post.mockRejectedValueOnce(new Error("network")).mockResolvedValueOnce({ data: { message: "Gespeichert" } });
  props.onRefresh.mockResolvedValue();
  render(<CraftingDialog {...props} />);
  fireEvent.click(screen.getByLabelText(/Ich befinde mich/));
  fireEvent.click(screen.getByLabelText(/Ich bestätige das unten/));
  fireEvent.click(screen.getByRole("button", { name: "Herstellung abschließen" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("nicht doppelt");
  fireEvent.click(screen.getByRole("button", { name: "Erneut versuchen" }));
  await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(2));
  expect(axios.post.mock.calls[0][1].operationId).toBe(axios.post.mock.calls[1][1].operationId);
  expect(await screen.findByText("Gespeichert")).toBeInTheDocument();
});

test("requires renewed confirmation after changing the result", () => {
  render(<CraftingDialog {...props} />);
  fireEvent.click(screen.getByLabelText(/Ich befinde mich/));
  fireEvent.click(screen.getByLabelText(/Ich bestätige das unten/));
  expect(screen.getByText("2/2")).toBeInTheDocument();
  fireEvent.click(screen.getByLabelText("Kritischer Misserfolg"));
  expect(screen.getByText("1/2")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Misserfolg bestätigen" })).toBeDisabled();
});

test("refreshes stale inventory after a conflict and prevents resubmission", async () => {
  axios.post.mockRejectedValue({ response: { status: 409, data: { message: "Nicht genügend Materialien." } } });
  props.onRefresh.mockResolvedValue();
  render(<CraftingDialog {...props} />);
  fireEvent.click(screen.getByLabelText(/Ich befinde mich/));
  fireEvent.click(screen.getByLabelText(/Ich bestätige das unten/));
  fireEvent.click(screen.getByRole("button", { name: "Herstellung abschließen" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Nicht genügend Materialien.");
  await waitFor(() => expect(props.onRefresh).toHaveBeenCalled());
  expect(screen.getByRole("button", { name: "Herstellung abschließen" })).toBeDisabled();
});
