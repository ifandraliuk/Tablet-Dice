import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useDispatch, useSelector } from "react-redux";
import { postDiary } from "../../features/diary/diarySlice";
import Diary from "./index";

const mockNavigate = jest.fn();
jest.mock("react-redux", () => ({ useDispatch: jest.fn(), useSelector: jest.fn() }));
jest.mock("react-router-dom", () => ({ useNavigate: () => mockNavigate }));
jest.mock("../../features/diary/diarySlice", () => ({
  getUsers: () => ({ type: "users" }),
  getMyDiary: () => ({ type: "diary" }),
  postDiary: jest.fn((data) => ({ type: "post", data })),
  editDiary: jest.fn(),
  removeDiary: jest.fn(),
}));
jest.mock("react-quill", () => ({ value, onChange }) => (
  <textarea aria-label="Notiztext" value={value} onChange={(event) => onChange(event.target.value)} />
));
jest.mock("./DiarySidebar", () => () => null);
jest.mock("./ActiveDiaryPage", () => () => null);

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
  const state = {
    auth: { user: { _id: "me", name: "Ich" } },
    player: { fractionTheme: "Welles" },
    diaries: {
      diary: [],
      userList: [{ id: "me", name: "Ich" }, { id: "friend", name: "Freund" }],
    },
  };
  useSelector.mockImplementation((selector) => selector(state));
});

test("saves a new note with the selected participants", async () => {
  useDispatch.mockReturnValue(() => ({ unwrap: () => Promise.resolve() }));
  render(<Diary />);
  fireEvent.click(screen.getByTitle("Neue Notiz"));
  expect(screen.getByLabelText("Kategorie")).toHaveValue("Personen");
  fireEvent.change(screen.getByLabelText("Kategorie"), { target: { value: "Erlebtes" } });
  fireEvent.change(screen.getByLabelText("Notiztext"), { target: { value: "Das Abenteuer" } });
  fireEvent.click(screen.getByRole("button", { name: "Teilen mit 0 Mitspielern" }));
  fireEvent.click(screen.getByRole("checkbox", { name: /Freund/ }));
  fireEvent.click(screen.getByRole("button", { name: "Übernehmen" }));
  fireEvent.click(screen.getByRole("button", { name: "Speichern" }));

  await waitFor(() => expect(postDiary).toHaveBeenCalledWith({
    text: "Das Abenteuer",
    category: "Erlebtes",
    players: ["me", "friend"],
  }));
  await waitFor(() => expect(screen.queryByLabelText("Notiztext")).not.toBeInTheDocument());
  expect(localStorage.getItem("diary-active-category")).toBe("Erlebtes");
  expect(screen.getByRole("tab", { name: "Gemeinsame Einträge (0)" })).toHaveAttribute("aria-selected", "true");
});

test("defaults to the current category and leaves it unchanged when cancelling", () => {
  localStorage.setItem("diary-active-category", "Orte");
  useDispatch.mockReturnValue(() => ({ unwrap: () => Promise.resolve() }));
  render(<Diary />);
  fireEvent.click(screen.getByTitle("Neue Notiz"));
  expect(screen.getByLabelText("Kategorie")).toHaveValue("Orte");
  fireEvent.change(screen.getByLabelText("Kategorie"), { target: { value: "Erlebtes" } });
  fireEvent.click(screen.getByRole("button", { name: "Abbrechen" }));
  fireEvent.click(screen.getByRole("button", { name: "Änderungen verwerfen" }));
  expect(localStorage.getItem("diary-active-category")).toBe("Orte");
  fireEvent.click(screen.getByTitle("Neue Notiz"));
  expect(screen.getByLabelText("Kategorie")).toHaveValue("Orte");
});

test("switches to private entries after creating a private note", async () => {
  localStorage.setItem("diary-view-mode", "shared");
  useDispatch.mockReturnValue(() => ({ unwrap: () => Promise.resolve() }));
  render(<Diary />);
  fireEvent.click(screen.getByTitle("Neue Notiz"));
  fireEvent.change(screen.getByLabelText("Notiztext"), { target: { value: "Privat" } });
  fireEvent.click(screen.getByRole("button", { name: "Speichern" }));
  await waitFor(() => expect(screen.getByRole("tab", { name: "Private Einträge (0)" })).toHaveAttribute("aria-selected", "true"));
});

test("counts private and shared entries only in the active category", () => {
  useDispatch.mockReturnValue(() => ({ unwrap: () => Promise.resolve() }));
  const state = {
    auth: { user: { _id: "me", name: "Ich" } },
    player: { fractionTheme: "Welles" },
    diaries: {
      userList: [],
      diary: [
        { category: "Personen", players: ["me"] },
        { category: "Personen", players: ["me", "friend"] },
        { category: "Orte", players: ["me", "friend"] },
      ],
    },
  };
  useSelector.mockImplementation((selector) => selector(state));
  render(<Diary />);
  expect(screen.getByRole("tab", { name: "Private Einträge (1)" })).toBeInTheDocument();
  expect(screen.getByRole("tab", { name: "Gemeinsame Einträge (1)" })).toBeInTheDocument();
});

test("keeps a failed creation and its selected participants for retry", async () => {
  useDispatch.mockReturnValue(() => ({ unwrap: () => Promise.reject("Speichern fehlgeschlagen") }));
  render(<Diary />);
  fireEvent.click(screen.getByTitle("Neue Notiz"));
  fireEvent.change(screen.getByLabelText("Kategorie"), { target: { value: "Erlebtes" } });
  fireEvent.change(screen.getByLabelText("Notiztext"), { target: { value: "Das Abenteuer" } });
  fireEvent.click(screen.getByRole("button", { name: "Teilen mit 0 Mitspielern" }));
  fireEvent.click(screen.getByRole("checkbox", { name: /Freund/ }));
  fireEvent.click(screen.getByRole("button", { name: "Übernehmen" }));
  fireEvent.click(screen.getByRole("button", { name: "Speichern" }));

  expect(await screen.findByRole("alert")).toHaveTextContent("Speichern fehlgeschlagen");
  expect(screen.getByLabelText("Notiztext")).toHaveValue("Das Abenteuer");
  expect(screen.getByLabelText("Kategorie")).toHaveValue("Erlebtes");
  expect(localStorage.getItem("diary-active-category")).toBe("Personen");
  expect(screen.getByRole("button", { name: "Teilen mit 1 Mitspieler" })).toBeInTheDocument();
  expect(screen.getByRole("tab", { name: "Private Einträge (0)" })).toHaveAttribute("aria-selected", "true");
});
