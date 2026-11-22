import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { useDispatch, useSelector } from "react-redux";
import Diary from "./index";

const mockNavigate = jest.fn();
jest.mock("react-redux", () => ({ useDispatch: jest.fn(), useSelector: jest.fn() }));
jest.mock("react-router-dom", () => ({ useNavigate: () => mockNavigate }));
jest.mock("../../features/diary/diarySlice", () => ({
  getUsers: () => ({ type: "users" }),
  getMyDiary: () => ({ type: "diary" }),
  postDiary: jest.fn((data) => ({ type: "post", data })),
  editDiary: jest.fn((data) => ({ type: "edit", data })),
  removeDiary: jest.fn(),
}));
jest.mock("react-quill", () => ({ value, onChange }) => (
  <textarea aria-label="Notiztext" value={value} onChange={(event) => onChange(event.target.value)} />
));

beforeEach(() => {
  localStorage.clear();
  const state = {
    auth: { user: { _id: "me", name: "Ich" } },
    player: { fractionTheme: "Welles" },
    diaries: {
      userList: [{ id: "me", name: "Ich" }, { id: "friend", name: "Freund" }],
      diary: [{
        _id: "note",
        category: "Personen",
        text: "Alte Erinnerung",
        players: [{ _id: "me", name: "Ich" }],
      }],
    },
  };
  useSelector.mockImplementation((selector) => selector(state));
  useDispatch.mockReturnValue(() => ({ unwrap: () => Promise.resolve() }));
});

function openEditor() {
  fireEvent.click(document.querySelector(".btn-edit"));
}

function confirmDialog() {
  return screen.getByRole("dialog", { name: "Änderungen verwerfen?" });
}

test("asks before closing a new draft and preserves it when continuing", () => {
  render(<Diary />);
  fireEvent.click(screen.getByTitle("Neue Notiz"));
  fireEvent.change(screen.getByLabelText("Notiztext"), { target: { value: "Mein Abenteuer" } });
  fireEvent.click(document.querySelector(".note-popup-backdrop"));
  fireEvent.click(within(confirmDialog()).getByRole("button", { name: "Weiter bearbeiten" }));
  expect(screen.getByLabelText("Notiztext")).toHaveValue("Mein Abenteuer");
  fireEvent.click(within(document.querySelector(".note-popup")).getByRole("button", { name: "Abbrechen" }));
  fireEvent.click(within(confirmDialog()).getByRole("button", { name: "Änderungen verwerfen" }));
  expect(screen.queryByLabelText("Notiztext")).not.toBeInTheDocument();
});

test("closes an empty editor without confirmation, including an empty Quill paragraph", () => {
  render(<Diary />);
  fireEvent.click(screen.getByTitle("Neue Notiz"));
  fireEvent.change(screen.getByLabelText("Notiztext"), { target: { value: "<p><br></p>" } });
  fireEvent.click(screen.getByRole("button", { name: "Abbrechen" }));
  expect(screen.queryByRole("dialog", { name: "Änderungen verwerfen?" })).not.toBeInTheDocument();
  expect(screen.queryByLabelText("Notiztext")).not.toBeInTheDocument();
});

test("protects a changed share selection even without text", () => {
  render(<Diary />);
  fireEvent.click(screen.getByTitle("Neue Notiz"));
  fireEvent.click(screen.getByRole("button", { name: "Teilen mit 0 Mitspielern" }));
  fireEvent.click(screen.getByRole("checkbox", { name: /Freund/ }));
  fireEvent.click(screen.getByRole("button", { name: "Übernehmen" }));
  fireEvent.click(within(document.querySelector(".note-popup")).getByRole("button", { name: "Abbrechen" }));
  expect(confirmDialog()).toBeInTheDocument();
});

test("guards category and tab changes while editing, and leaves the draft intact on cancel", () => {
  render(<Diary />);
  openEditor();
  fireEvent.change(screen.getByLabelText("Notiztext"), { target: { value: "Neue Erinnerung" } });
  fireEvent.click(screen.getByRole("button", { name: /Orte/ }));
  fireEvent.click(within(confirmDialog()).getByRole("button", { name: "Weiter bearbeiten" }));
  expect(screen.getByLabelText("Notiztext")).toHaveValue("Neue Erinnerung");
  expect(localStorage.getItem("diary-active-category")).toBe("Personen");
  fireEvent.click(screen.getByRole("tab", { name: "Gemeinsame Einträge (0)" }));
  fireEvent.click(within(confirmDialog()).getByRole("button", { name: "Änderungen verwerfen" }));
  expect(screen.getByRole("tab", { name: "Gemeinsame Einträge (0)" })).toHaveAttribute("aria-selected", "true");
  fireEvent.click(screen.getByRole("tab", { name: "Private Einträge (1)" }));
  expect(screen.getByText("Alte Erinnerung")).toBeInTheDocument();
  expect(screen.queryByLabelText("Notiztext")).not.toBeInTheDocument();
});

test("guards the editor discard button and creating another note", () => {
  render(<Diary />);
  openEditor();
  fireEvent.change(screen.getByLabelText("Notiztext"), { target: { value: "Entwurf" } });
  fireEvent.click(screen.getByTitle("Verwerfen"));
  fireEvent.click(within(confirmDialog()).getByRole("button", { name: "Weiter bearbeiten" }));
  fireEvent.click(screen.getByTitle("Neue Notiz"));
  fireEvent.click(within(confirmDialog()).getByRole("button", { name: "Änderungen verwerfen" }));
  expect(screen.getByRole("heading", { name: "Neue Notiz" })).toBeInTheDocument();
  expect(screen.getByLabelText("Notiztext")).toHaveValue("");
});

test("guards participant-only changes in an existing note", () => {
  render(<Diary />);
  openEditor();
  fireEvent.click(screen.getByTitle("Teilen"));
  fireEvent.click(screen.getByRole("checkbox", { name: /Freund/ }));
  fireEvent.click(screen.getByRole("button", { name: "Übernehmen" }));
  fireEvent.click(screen.getByTitle("Verwerfen"));
  expect(confirmDialog()).toBeInTheDocument();
  fireEvent.click(within(confirmDialog()).getByRole("button", { name: "Weiter bearbeiten" }));
  fireEvent.click(screen.getByTitle("Teilen"));
  expect(screen.getByRole("checkbox", { name: /Freund/ })).toBeChecked();
});

test("allows leaving an unchanged edit without confirmation", () => {
  render(<Diary />);
  openEditor();
  fireEvent.click(screen.getByRole("button", { name: /Orte/ }));
  expect(screen.queryByRole("dialog", { name: "Änderungen verwerfen?" })).not.toBeInTheDocument();
  expect(localStorage.getItem("diary-active-category")).toBe("Orte");
});
