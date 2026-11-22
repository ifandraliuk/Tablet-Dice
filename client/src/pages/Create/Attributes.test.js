import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import creationReducer, { setAttribute } from "../../features/creation/creationSlice";
import Attributes from "./Attributes";

jest.mock("../../features/creation/creationService", () => ({}));

test("distributes points, enforces vitality and resets completion", () => {
  const store = configureStore({ reducer: { creation: creationReducer } });
  render(<Provider store={store}><Attributes /></Provider>);

  expect(screen.getByRole("status")).toHaveTextContent("70 von 70 Punkten frei");
  fireEvent.change(screen.getByLabelText("Stärke"), { target: { value: "70" } });
  expect(screen.getByRole("status")).toHaveTextContent("0 von 70 Punkten frei");
  expect(screen.getByRole("alert")).toHaveTextContent("Vitalität muss mindestens 1 betragen");
  expect(store.getState().creation.completionFlags.attributes).toBe(false);
  fireEvent.click(screen.getByRole("button", { name: "Stärke verringern" }));
  fireEvent.click(screen.getByRole("button", { name: "Vitalität erhöhen" }));
  expect(store.getState().creation.completionFlags.attributes).toBe(true);
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Zurücksetzen" }));
  expect(screen.getByLabelText("Stärke")).toHaveValue(0);
  expect(screen.getByRole("status")).toHaveTextContent("70 von 70 Punkten frei");
  expect(store.getState().creation.completionFlags.attributes).toBe(false);
});

test("rejects invalid and over-budget values without corrupting points", () => {
  const store = configureStore({ reducer: { creation: creationReducer } });
  render(<Provider store={store}><Attributes /></Provider>);
  fireEvent.change(screen.getByLabelText("Mana"), { target: { value: "-1" } });
  expect(screen.getByRole("alert")).toHaveTextContent("ganze Zahl ab 0");
  fireEvent.change(screen.getByLabelText("Mana"), { target: { value: "71" } });
  expect(screen.getByRole("alert")).toHaveTextContent("nicht genügend freie Punkte");
  expect(screen.getByLabelText("Mana")).toHaveValue(0);
  expect(store.getState().creation.availablePoints).toBe(70);
  const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
  const state = creationReducer(store.getState().creation, setAttribute({ id: "mana", value: NaN }));
  expect(state.availablePoints).toBe(70);
  expect(state.attributes.mana).toBe(0);
  expect(warn).toHaveBeenCalled();
  warn.mockRestore();
});
