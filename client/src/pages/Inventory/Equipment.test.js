import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { useSelector } from "react-redux";
import Equipment from "./Equipment";

jest.mock("react-redux", () => ({
  useDispatch: () => jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock("./EquippedItem", () => () => null);
jest.mock("../../components/ItemIcon", () => () => null);
jest.mock("../../features/inventory/inventorySlice", () => ({
  getUserWeapons: jest.fn(),
}));
jest.mock("../../features/player/playerSlice", () => ({
  getProfession: jest.fn(),
}));

const renderEquipment = (armorBoni) => {
  useSelector.mockImplementation((selector) =>
    selector({
      inventory: {
        inventory: [],
        armor: 7,
        armorCategory: "Mittel",
        armorBoni,
      },
      player: { fractionTheme: "Welles" },
    })
  );
  return render(<Equipment onSelectEmptySlot={jest.fn()} />);
};

test("explains protection values in a dialog without changing the displayed stats", async () => {
  renderEquipment([{ bonus: { type: "Magie" }, value: 15 }]);
  const summary = screen.getByRole("group", { name: "Rüstungs- und Widerstandswerte" });
  const heading = screen.getByRole("heading", { name: "Ausrüstung" }).parentElement;
  const button = within(heading).getByRole("button", {
    name: "Informationen zu Rüstung und Widerständen",
  });

  expect(button).toHaveAttribute("aria-haspopup", "dialog");
  expect(within(summary).getByRole("group", { name: "Rüstung: 7" })).toBeInTheDocument();
  expect(within(summary).getByRole("group", { name: "Magie: 15" })).toBeInTheDocument();
  expect(within(summary).getByRole("group", { name: "Hitze: 0" })).toBeInTheDocument();
  button.focus();
  fireEvent.click(button);
  const details = await screen.findByRole("dialog", { name: "Rüstung und Widerstände" });
  expect(details).toHaveTextContent("Leicht: 0 bis 1,6 kg. 1 Kampfaktion, 1 Paradeaktion und 1 Bonusaktion.");
  expect(details).toHaveTextContent("Mittel: 1,7 bis 3,9 kg. 1 Kampfaktion und 1 Paradeaktion, keine Bonusaktion");
  expect(details).toHaveTextContent("Schwer (Kette): 4 bis 6,5 kg.");
  expect(details).toHaveTextContent("Heimlichkeit −1 pro Rüstungsgegenstand");
  expect(details).toHaveTextContent("Schwer (Platte): ab 6,6 kg.");
  expect(details).toHaveTextContent("Geschicklichkeit −1 und Heimlichkeit −2 pro Rüstungsgegenstand");
  expect(details).toHaveTextContent("Plattenrüstung derzeit nur bis 10 kg");
  expect(details).toHaveTextContent("Werkzeug");
  expect(details).toHaveTextContent("nicht automatisch");
  expect(details).toHaveTextContent("Bei schwerer Rüstung blendet das Dashboard Bonusaktion und Reaktion aus.");
  expect(details).toHaveTextContent("Widerstand mindestens so hoch wie der Wurf");
  expect(details).toHaveTextContent("Kälte · W20:");
  expect(details).toHaveTextContent("Frost · W20 + W12:");
  expect(details).toHaveTextContent("Polarfrost · 2 W20:");
  expect(details).toHaveTextContent("Trockene Hitze · W20:");
  expect(details).toHaveTextContent("Schwüle Hitze · W20:");
  expect(details).toHaveTextContent("Hölle · 2 W20:");
  expect(details).toHaveTextContent("Regen · W20:");
  expect(details).toHaveTextContent("Gewittersturm · W20 + W12:");
  expect(details).toHaveTextContent("Apokalyptischer Orkanregen · 2 W20:");
  const coldSummary = within(details).getByText("Kälte und Frost");
  expect(coldSummary.parentElement).not.toHaveAttribute("open");
  fireEvent.click(coldSummary);
  expect(coldSummary.parentElement).toHaveAttribute("open");
  expect(details).not.toHaveTextContent("Andere Gewichte werden aktuell");
  fireEvent.click(within(details).getByRole("button", { name: "Close" }));
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  expect(button).toHaveFocus();
});

test("closes the protection dialog with Escape", async () => {
  renderEquipment([]);
  fireEvent.click(screen.getByRole("button", {
    name: "Informationen zu Rüstung und Widerständen",
  }));
  const dialog = await screen.findByRole("dialog", { name: "Rüstung und Widerstände" });
  fireEvent.keyDown(dialog, { key: "Escape", code: "Escape" });
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
});

test("shows zero resistance when bonuses are unavailable", () => {
  renderEquipment(undefined);
  expect(screen.getByRole("group", { name: "Magie: 0" })).toBeInTheDocument();
  expect(screen.getByRole("group", { name: "Wasser: 0" })).toBeInTheDocument();
});
