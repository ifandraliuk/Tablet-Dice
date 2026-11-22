import React from "react";
import { configureStore } from "@reduxjs/toolkit";
import { act, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import Bar from "./Bar";

jest.mock("../../features/player/playerService", () => ({}));

function renderBar(category, current, maxAttribute = 10) {
  const store = configureStore({
    reducer: {
      player: (state = {
        attributes: { [category]: maxAttribute },
        bars: { [category]: current },
        attributesLoaded: false,
      }, action) => action.type === "setBar"
        ? { ...state, bars: { ...state.bars, [category]: action.payload } }
        : state,
    },
  });
  render(
    <Provider store={store}>
      <Bar category={category} />
    </Provider>
  );
  return store;
}

test.each([
  ["vitality", "Vitalität"],
  ["stamina", "Ausdauer"],
  ["mana", "Mana"],
  ["spirit", "Spirituelle Kraft"],
])("renders the %s resource with its own color and value", (category, label) => {
  renderBar(category, 25);

  const bar = screen.getByRole("progressbar", { name: label });
  expect(bar).toHaveAttribute("aria-valuenow", "25");
  expect(bar).toHaveAttribute("aria-valuemax", "100");
  expect(bar).toHaveAttribute("aria-valuetext", "25 von 100");
  expect(bar).toHaveTextContent(`${label}: 25 / 100`);
  expect(bar.firstChild).toHaveClass(`dashboard-resource-bar__fill--${category}`);
  expect(bar.firstChild).toHaveStyle({ width: "25%" });
});

test("keeps the label visible at zero and updates the fill with the resource", () => {
  const store = renderBar("vitality", 0);
  const bar = screen.getByRole("progressbar", { name: "Vitalität" });

  expect(bar).toHaveTextContent("Vitalität: 0 / 100");
  expect(bar.firstChild).toHaveStyle({ width: "0%" });

  act(() => store.dispatch({ type: "setBar", payload: 100 }));
  expect(bar).toHaveTextContent("Vitalität: 100 / 100");
  expect(bar.firstChild).toHaveStyle({ width: "100%" });
});

test("bounds the fill and accessible value to the resource maximum", () => {
  renderBar("mana", 120);
  const bar = screen.getByRole("progressbar", { name: "Mana" });

  expect(bar).toHaveAttribute("aria-valuenow", "100");
  expect(bar).toHaveAttribute("aria-valuetext", "120 von 100");
  expect(bar.firstChild).toHaveStyle({ width: "100%" });
});
