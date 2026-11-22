import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import creationReducer, { resetCreation } from "../../features/creation/creationSlice";
import CreateCharacter from "./index";
import CreateWindow from "./CreateWindow";
import originColors from "../../data/OriginColors";

jest.mock("../../features/creation/creationService", () => ({}));
jest.mock("../../features/auth/authService", () => ({}));
jest.mock("../../components/Fraction", () => ({ fraction }) => <div>{fraction} Wappen</div>);

test("keeps inputs and applies the selected origin color across creation steps", () => {
  const store = configureStore({
    reducer: {
      creation: creationReducer,
      auth: (state = { user: null, isSuccess: false, isError: false }) => state,
    },
  });

  const { container } = render(<Provider store={store}><MemoryRouter><CreateCharacter /></MemoryRouter></Provider>);
  const page = container.querySelector(".create-page");
  const navigation = screen.getByRole("navigation", { name: "Schritte der Charaktererstellung" });
  expect(within(navigation).getAllByRole("button").map((button) => button.querySelector("span").textContent))
    .toEqual(["Herkunft", "Allgemein", "Profession", "Attribute", "Namensgebung"]);
  expect(within(navigation).getByRole("button", { name: /Herkunft/ })).toHaveAttribute("aria-current", "step");
  expect(screen.getByText(/Ein Sonnenstrahl kitzelt dich wach/)).toBeInTheDocument();
  expect(page.style.getPropertyValue("--diary-origin-color")).toBe("");
  expect(screen.getByRole("button", { name: /Namensgebung/ })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: /Allgemein Offen/ }));
  expect(screen.getByText(/Du stehst auf und wirfst einen Blick in den Spiegel/)).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText(/Augenfarbe/), { target: { value: "Grün" } });
  fireEvent.click(screen.getByRole("button", { name: /Herkunft Offen/ }));
  const choice = screen.getByRole("button", { name: "Königreich Algor" });
  fireEvent.click(choice);
  expect(choice).toHaveAttribute("aria-pressed", "true");
  expect(page.style.getPropertyValue("--diary-origin-color")).toBe(originColors.Algor);
  expect(screen.getByText("Algor Wappen")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /Allgemein Offen/ }));
  expect(screen.getByLabelText(/Augenfarbe/)).toHaveValue("Grün");
  expect(page.style.getPropertyValue("--diary-origin-color")).toBe(originColors.Algor);
  expect(within(navigation).getByRole("button", { name: /Allgemein/ })).toHaveAttribute("aria-current", "step");
  expect(creationReducer(store.getState().creation, resetCreation()).partActive).toBe("origin");
});

test("naming dialog submits the entered data and cancels without submitting", () => {
  const store = configureStore({
    reducer: {
      creation: creationReducer,
      auth: (state = { isSuccess: false, isError: false }) => state,
    },
  });

  const onSubmit = jest.fn((event) => event.preventDefault());
  const onClose = jest.fn();
  render(<Provider store={store}><CreateWindow origin="Algor" onSubmit={onSubmit} onClose={onClose} /></Provider>);
  const dialog = screen.getByRole("dialog", { name: "Namensgebung" });
  expect(dialog.style.getPropertyValue("--diary-origin-color")).toBe(originColors.Algor);
  fireEvent.change(within(dialog).getByLabelText(/^Name/), { target: { value: "Held" } });
  fireEvent.change(within(dialog).getByLabelText(/^Passwort \*/), { target: { value: "geheim" } });
  fireEvent.change(within(dialog).getByLabelText(/Passwort wiederholen/), { target: { value: "geheim" } });
  fireEvent.submit(within(dialog).getByRole("button", { name: "Bestätigen" }).closest("form"));
  expect(onSubmit.mock.calls[0][1]).toEqual({ name: "Held", pwd: "geheim", check: "geheim" });
  fireEvent.click(within(dialog).getByRole("button", { name: "Abbrechen" }));
  expect(onClose).toHaveBeenCalledTimes(1);
  expect(onSubmit).toHaveBeenCalledTimes(1);
});

test("shows the first ability reminder until an ability is selected", () => {
  const initialCreation = creationReducer(undefined, { type: "init" });
  const store = configureStore({
    reducer: { creation: creationReducer, auth: (state = { user: null }) => state },
    preloadedState: {
      creation: {
        ...initialCreation,
        partActive: "profession",
        professionList: [
          { _id: "profession", name: "Krieger", abilities: [{ _id: "ability", name: "Schlag", specialization: "Novize", description: "Ein Schlag", type: "stamina", price: 1, dice: "1W6" }] },
          { _id: "other", name: "Späher", abilities: [] },
        ],
      },
    },
  });
  render(<Provider store={store}><MemoryRouter><CreateCharacter /></MemoryRouter></Provider>);
  expect(screen.getByRole("heading", { name: "Fertigkeiten" })).toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent("Wähle deine erste Fertigkeit");
  fireEvent.click(screen.getByRole("button", { name: "Krieger" }));
  expect(screen.getByRole("status")).toHaveTextContent("Wähle deine erste Fertigkeit");
  fireEvent.click(screen.getByRole("button", { name: "Wählen" }));
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Späher" }));
  expect(screen.getByRole("status")).toHaveTextContent("Wähle deine erste Fertigkeit");
});
