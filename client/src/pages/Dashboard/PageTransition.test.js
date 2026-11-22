import React from "react";
import { act, render, screen, within } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import Dashboard from "./index";
import InventoryPage from "../Inventory";
import playerReducer, { getAttributes, getProfession } from "../../features/player/playerSlice";
import inventoryReducer, { getArmor } from "../../features/inventory/inventorySlice";

jest.mock("../../features/player/playerService", () => ({}));
jest.mock("../../features/inventory/inventoryService", () => ({}));
jest.mock("react-router-dom", () => {
  const navigate = jest.fn();
  return { useNavigate: () => navigate };
});
jest.mock("../Inventory/Equipment", () => () => null);
jest.mock("../Inventory/ItemsView", () => () => null);
jest.mock("../Inventory/Slot", () => () => null);
jest.mock("../Inventory/ExtendedInfo", () => () => null);
jest.mock("../../components/AbilityCard", () => ({ ability }) => <div>{ability.name}</div>);
jest.mock("../../components/Fraction", () => () => null);

const user = { _id: "user", name: "Held", token: "token" };
const ignoreRequests = () => (next) => (action) =>
  typeof action === "function" ? undefined : next(action);

function makeStore() {
  return configureStore({
    reducer: {
      auth: (state = { user }) => state,
      player: playerReducer,
      inventory: inventoryReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: false }).prepend(ignoreRequests),
  });
}

function Pages({ store, inventory, dashboard }) {
  return (
    <Provider store={store}>
      {inventory && <InventoryPage />}
      {dashboard && <Dashboard />}
    </Provider>
  );
}

function receiveDashboardData(store) {
  act(() => {
    store.dispatch(getAttributes.fulfilled({
      attributes: { vitality: 5, stamina: 4, strength: 3 },
      pointsLeft: 12,
    }, "attributes"));
    store.dispatch(getProfession.fulfilled({
      _id: "class",
      name: "Klasse",
      abilities: [{ _id: "ability", name: "Testfertigkeit", specialization: "Kampf" }],
    }, "profession"));
    store.dispatch(getArmor.fulfilled({ armor: 12, armorCategory: 2 }, "armor"));
  });
}

test("keeps loaded dashboard data when the outgoing inventory finishes unmounting", () => {
  const store = makeStore();
  const view = render(<Pages store={store} inventory />);
  view.rerender(<Pages store={store} inventory dashboard />);
  receiveDashboardData(store);
  view.rerender(<Pages store={store} dashboard />);

  expect(screen.getByText("Testfertigkeit")).toBeInTheDocument();
  expect(screen.getByRole("progressbar", { name: "Vitalität" })).toHaveAttribute("aria-valuemax", "50");
  expect(within(document.querySelector(".dashboard-attribute-grid")).getByText("Stärke")).toBeInTheDocument();
  expect(store.getState().player.attributes.strength).toBe(3);
  expect(store.getState().inventory.armor).toBe(12);
});

test("keeps newly loaded player data when the outgoing dashboard finishes unmounting", () => {
  const store = makeStore();
  const view = render(<Pages store={store} dashboard />);
  receiveDashboardData(store);
  view.rerender(<Pages store={store} dashboard={false} />);
  expect(store.getState().player.attributes.strength).toBe(3);
  expect(store.getState().player.profession.name).toBe("Klasse");
});
