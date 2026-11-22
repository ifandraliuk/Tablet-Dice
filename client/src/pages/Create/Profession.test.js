import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import creationReducer from "../../features/creation/creationSlice";
import Profession from "./Profession";

jest.mock("../../features/creation/creationService", () => ({}));

test.each([
  ["Ausdauerklasse", "stamina", "bolt"],
  ["Manaklasse", "mana", "star"],
  ["Spiritklasse", "spirit", "ghost"],
  ["Andere Klasse", null, null],
])("shows the %s category with its matching badge", (category, resource, icon) => {
  const profession = { _id: "test", name: "Testprofession", category, abilities: [] };
  const initialState = creationReducer(undefined, { type: "init" });
  const store = configureStore({
    reducer: { creation: creationReducer },
    preloadedState: { creation: { ...initialState, professionList: [profession] } },
  });
  render(<Provider store={store}><Profession /></Provider>);
  fireEvent.click(screen.getByRole("button", { name: "Testprofession" }));
  const badge = screen.getByText(category);
  expect(badge).toHaveClass("create-profession__category");
  if (resource) {
    expect(badge).toHaveClass(`create-profession__category--${resource}`);
    expect(badge.querySelector("svg")).toHaveAttribute("data-icon", icon);
    expect(badge.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  } else {
    expect(badge.querySelector("svg")).toBeNull();
  }
});
