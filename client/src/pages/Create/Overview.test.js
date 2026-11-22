import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import creationReducer from "../../features/creation/creationSlice";
import Overview from "./Overview";

jest.mock("../../features/creation/creationService", () => ({}));
jest.mock("../../components/Fraction", () => ({ fraction }) => <div>{fraction} Wappen</div>);

function renderOverview(overrides = {}) {
  const ability = { _id: "ability", name: "Schlag", description: "Ein Angriff", specialization: "Novize", type: "stamina", price: 1, dice: "1W6" };
  const store = configureStore({
    reducer: { creation: creationReducer },
    preloadedState: {
      creation: {
        ...creationReducer(undefined, { type: "init" }),
        activeOrigin: "Königreich Algor",
        cuttedOrigin: "Algor",
        activeProfession: { _id: "profession", name: "Krieger", description: "Kampf", advantages: "Stark", abilities: [ability] },
        activeAbility: "ability",
        ...overrides,
      },
    },
  });
  const onClick = jest.fn();
  render(<Provider store={store}><Overview onClick={onClick} /></Provider>);
  return { store, onClick };
}

test("shows a read-only summary and requires a portrait before naming", async () => {
  const { store, onClick } = renderOverview();
  expect(screen.getByText("Königreich Algor")).toBeInTheDocument();
  expect(screen.getByText("Algor Wappen")).toBeInTheDocument();
  expect(screen.getByText("Spezies")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Schlag" })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /Activ|Verwenden/ })).not.toBeInTheDocument();
  const confirm = screen.getByRole("button", { name: "Weiter zur Namensgebung" });
  expect(confirm).toBeDisabled();
  fireEvent.change(screen.getByLabelText("Bild auswählen"), {
    target: { files: [new File(["image"], "portrait.png", { type: "image/png" })] },
  });
  await waitFor(() => expect(confirm).toBeEnabled());
  expect(store.getState().creation.userImage).toMatch(/^data:image\/png;base64,/);
  expect(screen.getByAltText("Dein gewähltes Charakterbild")).toBeInTheDocument();
  fireEvent.click(confirm);
  expect(onClick).toHaveBeenCalledTimes(1);
  fireEvent.click(within(screen.getByRole("region", { name: "Attribute" })).getByRole("button", { name: "Bearbeiten" }));
  expect(store.getState().creation.partActive).toBe("attributes");
});

test("reports invalid images and missing selected abilities", () => {
  const { onClick } = renderOverview({ activeAbility: "missing" });
  expect(screen.getByRole("alert")).toHaveTextContent("Fertigkeit wurde nicht gefunden");
  fireEvent.change(screen.getByLabelText("Bild auswählen"), {
    target: { files: [new File(["text"], "test.txt", { type: "text/plain" })] },
  });
  expect(screen.getByText("Bitte wähle eine Bilddatei aus.")).toHaveAttribute("role", "alert");
  expect(screen.getByRole("button", { name: "Weiter zur Namensgebung" })).toBeDisabled();
  expect(onClick).not.toHaveBeenCalled();
});
