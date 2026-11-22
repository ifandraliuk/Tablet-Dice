import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import Attributes from "./Attributes";
import playerReducer, { getAttributes } from "../../features/player/playerSlice";
import playerService from "../../features/player/playerService";

jest.mock("../../features/player/playerService", () => ({
  updateAttribute: jest.fn(),
}));

function renderAttributes(pointsLeft = 13) {
  const store = configureStore({
    reducer: {
      player: playerReducer,
      auth: (state = { user: { token: "test" } }) => state,
    },
  });
  store.dispatch(getAttributes.fulfilled({
    attributes: { vitality: 5, strength: 7, mana: 0 },
    pointsLeft,
  }, "load"));
  render(<Provider store={store}><Attributes /></Provider>);
  return store;
}

beforeEach(() => jest.resetAllMocks());

test("distributes one point and immediately updates the value and notice", async () => {
  let resolveUpdate;
  playerService.updateAttribute.mockReturnValue(new Promise((resolve) => { resolveUpdate = resolve; }));
  const store = renderAttributes();
  expect(screen.getByRole("status")).toHaveTextContent("1 Punkt verfügbar");
  expect(screen.queryByRole("button", { name: "Mana um 1 erhöhen" })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Stärke um 1 erhöhen" }));
  expect(screen.getByRole("button", { name: "Stärke um 1 erhöhen" })).toBeDisabled();
  expect(playerService.updateAttribute).toHaveBeenCalledTimes(1);
  expect(playerService.updateAttribute).toHaveBeenCalledWith("strength", "test");
  await act(async () => resolveUpdate({ attr: "strength", value: 8, pointsLeft: 13 }));
  expect(store.getState().player.attributes.strength).toBe(8);
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Stärke um 1 erhöhen" })).not.toBeInTheDocument();
});

test("shows several points and an explicit error with a retry", async () => {
  playerService.updateAttribute.mockRejectedValueOnce(new Error("Fehler beim Speichern"))
    .mockResolvedValueOnce({ attr: "vitality", value: 6, pointsLeft: 14 });
  renderAttributes(14);
  expect(screen.getByRole("status")).toHaveTextContent("2 Punkte verfügbar");
  fireEvent.click(screen.getByRole("button", { name: "Vitalität um 1 erhöhen" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Fehler beim Speichern");
  fireEvent.click(screen.getByRole("button", { name: "Vitalität um 1 erhöhen" }));
  await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("1 Punkt verfügbar"));
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

test("does not offer points when the budget is exhausted or below the total", () => {
  renderAttributes(11);
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /um 1 erhöhen/ })).not.toBeInTheDocument();
});
