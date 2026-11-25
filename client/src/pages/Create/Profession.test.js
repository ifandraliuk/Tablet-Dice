import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import creationReducer, { setGeneralInfo } from "../../features/creation/creationSlice";
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

test("updates the profession image when the selected sex or profession changes", () => {
  const professions = [
    { _id: "first", name: "Krieger", abilities: [] },
    { _id: "second", name: "Späher", abilities: [] },
  ];
  const initialState = creationReducer(undefined, { type: "init" });
  const store = configureStore({
    reducer: { creation: creationReducer },
    preloadedState: { creation: { ...initialState, professionList: professions } },
  });
  const { container } = render(<Provider store={store}><Profession /></Provider>);

  fireEvent.click(screen.getByRole("button", { name: "Krieger" }));
  const image = container.querySelector(".create-profession__details img");
  expect(image).toHaveAttribute("src", "/classes_img/m/first.svg");
  act(() => store.dispatch(setGeneralInfo({ name: "sex", value: "weiblich" })));
  expect(image).toHaveAttribute("src", "/classes_img/w/first.svg");
  fireEvent.click(screen.getByRole("button", { name: "Späher" }));
  expect(image).toHaveAttribute("src", "/classes_img/w/second.svg");
});

test("uses the existing profession image when a sex-specific image is missing", () => {
  const profession = { _id: "test", name: "Testprofession", abilities: [] };
  const initialState = creationReducer(undefined, { type: "init" });
  const store = configureStore({
    reducer: { creation: creationReducer },
    preloadedState: { creation: { ...initialState, professionList: [profession] } },
  });
  const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
  const { container } = render(<Provider store={store}><Profession /></Provider>);

  fireEvent.click(screen.getByRole("button", { name: "Testprofession" }));
  const image = container.querySelector(".create-profession__details img");
  fireEvent.error(image);
  expect(image).toHaveAttribute("src", "/classes_img/test.svg");
  fireEvent.error(image);
  expect(image).toHaveAttribute("src", "/classes_img/test.svg");
  expect(warn).toHaveBeenCalledTimes(2);
  act(() => store.dispatch(setGeneralInfo({ name: "sex", value: "weiblich" })));
  expect(image).toHaveAttribute("src", "/classes_img/w/test.svg");
  warn.mockRestore();
});
