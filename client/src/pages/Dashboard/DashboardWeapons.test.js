import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { useSelector } from "react-redux";
import Dashboard from "./index";

const mockDispatch = jest.fn();
const mockNavigate = jest.fn();

jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}));
jest.mock("react-router-dom", () => ({ useNavigate: () => mockNavigate }));
jest.mock("../../features/player/playerSlice", () => ({
  updateActions: () => ({ type: "updateActions" }),
  getAttributes: () => ({ type: "getAttributes" }),
  getGeneral: () => ({ type: "getGeneral" }),
  getLevel: () => ({ type: "getLevel" }),
  getProfession: () => ({ type: "getProfession" }),
  reset: () => ({ type: "reset" }),
  updateLevel: () => ({ type: "updateLevel" }),
}));
jest.mock("../../features/inventory/inventorySlice", () => ({
  getArmor: () => ({ type: "getArmor" }),
  getCategoryBoni: () => ({ type: "getCategoryBoni" }),
  getUserWeapons: () => ({ type: "getUserWeapons" }),
}));
jest.mock("./BarList", () => () => null);
jest.mock("./Abilities", () => () => null);
jest.mock("./Attributes", () => () => null);
jest.mock("./LevelUp", () => () => null);
jest.mock("./GeneralInfo", () => () => null);
jest.mock("../../components/Fraction", () => () => null);
jest.mock("../Inventory/ExtendedInfo", () => (props) => (
  <div role="dialog" aria-label={props.customItemInfo.item.name}>
    {props.compactWeapon ? "Kompakt" : "Vollständig"}
    <button onClick={() => props.setShowInfo(false)}>Schließen</button>
  </div>
));

const makeWeapon = (id, name) => ({
  _id: id,
  item: { _id: `item-${id}`, name, category: "Waffe", genus: "Schwert" },
});

function renderDashboard(weapons) {
  const state = {
    auth: { user: { _id: "user", name: "Held" } },
    player: {
      fractionTheme: "Welles",
      attributes: {},
      profession: {},
      level: 1,
    },
    inventory: { armorBoni: [], ...weapons },
  };
  useSelector.mockImplementation((selector) => selector(state));
  render(<Dashboard />);
}

test("opens and closes the compact view for each equipped weapon", () => {
  renderDashboard({
    mainWeapon: makeWeapon("main", "Schwert"),
    secondWeapon: makeWeapon("second", "Dolch"),
    rangedWeapon: makeWeapon("ranged", "Bogen"),
  });

  for (const [slot, name] of [
    ["Haupthand", "Schwert"],
    ["Nebenhand", "Dolch"],
    ["Fernkampf", "Bogen"],
  ]) {
    fireEvent.click(screen.getByRole("button", { name: `${slot}: ${name}. Details öffnen` }));
    expect(screen.getByRole("dialog", { name })).toHaveTextContent("Kompakt");
    fireEvent.click(screen.getByRole("button", { name: "Schließen" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  }
});

test("opens the ranged weapon even when the main hand is empty", () => {
  renderDashboard({
    mainWeapon: null,
    secondWeapon: null,
    rangedWeapon: makeWeapon("ranged", "Bogen"),
  });
  fireEvent.click(screen.getByRole("button", { name: "Fernkampf: Bogen. Details öffnen" }));
  expect(screen.getByRole("dialog", { name: "Bogen" })).toHaveTextContent("Kompakt");
});
