import React from "react";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import LevelUp from "./LevelUp";

const openDialog = (level, newLevel = jest.fn()) => {
  render(<LevelUp level={level} newLevel={newLevel} fraction="Welles" />);
  fireEvent.click(screen.getByRole("button", { name: `Stufe ${level} erreicht. Stufe erhöhen` }));
  return { dialog: screen.getByRole("dialog", { name: "Stufe erhöhen?" }), newLevel };
};

test.each([
  [4, 5, "Auf der nächsten Stufe darfst du 1 Attributspunkt verteilen."],
  [9, 10, "Auf der nächsten Stufe darfst du 1 Attributspunkt verteilen."],
  [8, 9, "Auf der nächsten Stufe darfst du 2 weitere Talentpunkte verteilen und 1 neue Fertigkeit lernen."],
])("explains the next level %i to %i without immediately increasing it", (level, next, description) => {
  const { dialog, newLevel } = openDialog(level);
  expect(newLevel).not.toHaveBeenCalled();
  expect(dialog).toHaveTextContent(`Du steigst von Stufe ${level} auf Stufe ${next} auf.`);
  expect(dialog).toHaveTextContent("Gamemaster (GM)");
  expect(dialog).toHaveTextContent(description);
  expect(dialog).toHaveTextContent("Auf jeder fünften Stufe");
  expect(dialog).toHaveTextContent("Auf allen anderen Stufen");
  fireEvent.click(within(dialog).getByRole("button", { name: "Abbrechen" }));
  expect(newLevel).not.toHaveBeenCalled();
});

test("confirms only once and keeps the dialog open until the request succeeds", async () => {
  let resolveRequest;
  const newLevel = jest.fn(() => new Promise((resolve) => { resolveRequest = resolve; }));
  const { dialog } = openDialog(8, newLevel);
  const confirm = within(dialog).getByRole("button", { name: "Stufe erhöhen" });
  fireEvent.click(confirm);
  fireEvent.click(confirm);
  expect(newLevel).toHaveBeenCalledTimes(1);
  expect(within(dialog).getByRole("button", { name: "Wird erhöht …" })).toBeDisabled();
  expect(within(dialog).getByRole("button", { name: "Abbrechen" })).toBeDisabled();
  await act(async () => resolveRequest());
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
});

test("shows a failed request and allows retry", async () => {
  const newLevel = jest.fn().mockRejectedValueOnce("Server nicht erreichbar").mockResolvedValueOnce();
  const { dialog } = openDialog(4, newLevel);
  fireEvent.click(within(dialog).getByRole("button", { name: "Stufe erhöhen" }));
  expect(await within(dialog).findByRole("alert")).toHaveTextContent("Server nicht erreichbar");
  fireEvent.click(within(dialog).getByRole("button", { name: "Stufe erhöhen" }));
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  expect(newLevel).toHaveBeenCalledTimes(2);
});

test("does not allow a level increase before the current level is loaded", () => {
  render(<LevelUp level={0} newLevel={jest.fn()} fraction="Welles" />);
  expect(screen.getByRole("button", { name: "Stufe 0 erreicht. Stufe erhöhen" })).toBeDisabled();
});
