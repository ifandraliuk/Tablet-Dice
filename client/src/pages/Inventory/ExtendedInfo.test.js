import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { useSelector } from "react-redux";
import ExtendedInfo from "./ExtendedInfo";

jest.mock("react-redux", () => ({
  useDispatch: () => jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock("../../features/diary/diarySlice", () => ({ getUsers: jest.fn() }));

const weapon = {
  _id: "inventory-1",
  amount: 2,
  item: {
    _id: "weapon-1",
    category: "Waffe",
    name: "Langschwert",
    rarity: "selten",
    genus: "Schwert",
    type: "Einhand",
    value: 1,
    price: "20",
    weight: 3,
    dice: "1W8",
    bonuses: "+2 Stärke",
    material: [],
  },
};

beforeEach(() => {
  useSelector.mockImplementation((selector) =>
    selector({
      inventory: { inventory: [], extendedId: "" },
      player: { fractionTheme: "Welles" },
      diaries: { userList: [] },
    })
  );
});

test("shows only the compact weapon details and closes by button or Escape", () => {
  const close = jest.fn();
  const { unmount } = render(
    <ExtendedInfo customItemInfo={weapon} minimized compactWeapon setShowInfo={close} />
  );
  const dialog = screen.getByRole("dialog", { name: "Gegenstand: Langschwert" });
  expect(dialog).toHaveClass("extended-info-modal--weapon");
  expect(within(dialog).getByRole("img")).toHaveAttribute(
    "src",
    "/color_icons/weapon/sword/weapon-1.svg"
  );
  expect(dialog).toHaveTextContent("selten");
  expect(dialog).toHaveTextContent("Waffe");
  expect(within(dialog).getByRole("heading", { name: "Langschwert" }).nextElementSibling)
    .toHaveTextContent("Waffe");
  expect(dialog).toHaveTextContent("Schaden");
  expect(dialog).toHaveTextContent("1W8");
  expect(dialog).toHaveTextContent("+2 Stärke");
  expect(dialog).not.toHaveTextContent("Gattung");
  expect(dialog).not.toHaveTextContent("Preis");
  expect(dialog).not.toHaveTextContent("Materialien");
  expect(dialog).not.toHaveTextContent("Hinzufügen");
  fireEvent.keyDown(window, { key: "Escape" });
  expect(close).toHaveBeenCalledWith(false);
  fireEvent.click(within(dialog).getByRole("button", { name: "Fenster schließen" }));
  expect(close).toHaveBeenCalledTimes(2);
  unmount();
});

test("retains the full item details for existing callers", () => {
  render(<ExtendedInfo customItemInfo={weapon} minimized setShowInfo={jest.fn()} />);
  const dialog = screen.getByRole("dialog", { name: "Gegenstand: Langschwert" });
  expect(dialog).not.toHaveClass("extended-info-modal--weapon");
  expect(dialog).toHaveTextContent("Gattung");
  expect(dialog).toHaveTextContent("Preis");
  expect(dialog).toHaveTextContent("Gewicht");
  expect(within(dialog).getByRole("heading", { name: "Langschwert" }).previousElementSibling)
    .toHaveTextContent("Waffe");
  expect(dialog).toHaveTextContent("1W8");
  expect(dialog).toHaveTextContent("+2 Stärke");
});
